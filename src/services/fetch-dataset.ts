import { axiosApi } from "./api-root";

export type DatasetRecord = Record<string, string | number | boolean | null>;

export interface DatasetResponse<T = DatasetRecord> {
  values?: T[];
}

export interface DatasetConstraint {
  fieldName: string;
  initialValue: string | number | boolean;
  finalValue?: string | number | boolean;
  constraintType?: "MUST" | "SHOULD" | "MUST_NOT";
}

interface FetchDatasetProps {
  datasetId: string;
  offset?: number;
  limit?: number;
  constraints?: DatasetConstraint[];
}

const CONSTRAINT_TYPE_MAP: Record<string, number> = {
  MUST: 1,
  SHOULD: 2,
  MUST_NOT: 3,
};

export async function fetchDataset<T = DatasetRecord>({ datasetId, offset, limit, constraints = [] }: FetchDatasetProps): Promise<{ items: T[]; hasNext: boolean }> {
  try {
    const base = "/dataset/api/v2/dataset-handle/search";
    const params = new URLSearchParams();

    params.set("datasetId", datasetId);

    if (offset != null && limit != null) {
      params.set("offset", String(offset));
      params.set("limit", String(limit));
    }

    // ✅ Formato correto para o Fluig v2
    constraints.forEach((c, index) => {
      const typeNum = CONSTRAINT_TYPE_MAP[c.constraintType ?? "MUST"];
      const finalVal = c.finalValue ?? c.initialValue;

      params.append(`constraint[${index}].fieldName`, c.fieldName);
      params.append(`constraint[${index}].initialValue`, String(c.initialValue));
      params.append(`constraint[${index}].finalValue`, String(finalVal));
      params.append(`constraint[${index}].type`, String(typeNum));
    });

    const url = `${base}?${params.toString()}`;

    const response = await axiosApi.get<DatasetResponse<T>>(url);

    return {
      items: response.data.values ?? [],
      hasNext: false,
    };
  } catch (error) {
    console.error("Erro ao buscar dataset:", error);
    return { items: [], hasNext: false };
  }
}
