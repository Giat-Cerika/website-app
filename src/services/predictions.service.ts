import axiosInstance from "@/lib/axios";

export interface SavePredictionPayload {
  patient_name: string;
  age: number;
  result: string;
  score: number;
  color: string;
  confidence: string;
  confidence_detail: Record<string, number>;
  description: string;
  caries_risk: any;
}

export const predictionService = {
  save: (payload: SavePredictionPayload) => {
    return axiosInstance.post("/prediction/save", payload);
  },
};
