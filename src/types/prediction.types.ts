export interface CariesRisk {
  attitude_and_status: number;
  caries_history: number;
  fluoride: number;
  modifying_factor: number;
  diet: {
    acid: number;
    sugar: number;
  };
  plaque?: {
    ph?: number;
    maturity?: number;
  };
  saliva?: {
    resting_saliva?: {
      hydration: number;
      viscosity: number;
      ph: number;
    };
    stimulated_saliva?: {
      quantity: number;
      ph: number;
      buffering: number;
    };
  };
}

export interface ConfidenceDetail {
  low: number;
  medium: number;
  high: number;
}

export interface Prediction {
  id: string;
  patient_name: string;
  age: number;
  date_of_evaluation: string;
  confidence: string;
  confidence_detail: ConfidenceDetail;
  score: number;
  result: string;
  description: string;
  caries_risk: CariesRisk;
}

export interface PredictionPagination {
  current_page: number;
  per_page: number;
  total_data: number;
  total_pages: number;
  next_page_url?: string;
}

export interface PredictionResponse {
  status_code: number;
  message: string;
  data: Prediction[];
  pagination: PredictionPagination;
}