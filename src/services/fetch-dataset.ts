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

export async function fetchDataset<T = DatasetRecord>({ datasetId, offset, limit, constraints = [] }: FetchDatasetProps): Promise<{ items: T[]; hasNext: boolean }> {
  try {
    const base = "/dataset/api/v2/dataset-handle/search";
    const params = new URLSearchParams();

    // datasetId
    params.set("datasetId", datasetId);

    // paginação
    if (offset != null && limit != null) {
      params.set("offset", String(offset));
      params.set("limit", String(limit));
    }

    // constraints
    constraints.forEach((c) => {
      const type = c.constraintType ?? "MUST";
      const finalVal = c.finalValue ?? c.initialValue;

      params.append("constraintsField", c.fieldName);
      params.append("constraintsInitialValue", String(c.initialValue));
      params.append("constraintsFinalValue", String(finalVal));
      params.append("constraintsType", type);
    });

    const query = params.toString();
    const url = `${base}?${query}`;
    // console.log(url, query);

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
