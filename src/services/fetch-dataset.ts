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
    const url = "/dataset/api/v2/dataset-handle/search";

    const body: Record<string, unknown> = {
      datasetId,
      constraints: constraints.map((c) => ({
        fieldName: c.fieldName,
        initialValue: String(c.initialValue),
        finalValue: String(c.finalValue ?? c.initialValue),
        type: { MUST: 1, SHOULD: 2, MUST_NOT: 3 }[c.constraintType ?? "MUST"],
      })),
    };

    if (offset != null) body.offset = offset;
    if (limit != null) body.limit = limit;

    const response = await axiosApi.post<DatasetResponse<T>>(url, body);

    return {
      items: response.data.values ?? [],
      hasNext: false,
    };
  } catch (error) {
    console.error("Erro ao buscar dataset:", error);
    return { items: [], hasNext: false };
  }
}
