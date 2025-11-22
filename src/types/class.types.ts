export interface Class {
  id: string;
  name_class: string;
  grade: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassRequest {
  name_class: string;
  grade: string;
  teacher: string;
}
