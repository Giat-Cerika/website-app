import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Question, CreateQuestionRequest } from "@/types/question.types";

export class QuestionRepository {
  endpoint = API_ENDPOINTS.QUESTION.BASE;

  async create(data: CreateQuestionRequest): Promise<Question> {
    const formData = new FormData();

    formData.append("quiz_id", data.quiz_id);
    formData.append("question_text", data.question_text);
    formData.append("answers", JSON.stringify(data.answers));

    if (data.question_image) {
      formData.append("question_image", data.question_image);
    }

    return (
      await axiosInstance.post(`${this.endpoint}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async getByQuizId(quizId: string): Promise<Question[]> {
    return (
      await axiosInstance.get(`${this.endpoint}/all/${quizId}`)
    ).data.data;
  }

  async delete(id: string): Promise<void> {
    return (
      await axiosInstance.delete(`${this.endpoint}/${id}/delete`)
    ).data;
  }
}