import api from "@/lib/api";
import type { Answer, Question } from "@/types/college";

export const getQuestions = async (): Promise<Question[]> => {
  const { data } = await api.get<Question[]>("/api/qa");
  return data;
};

export const getQuestionById = async (id: number): Promise<Question> => {
  const { data } = await api.get<Question>(`/api/qa/${id}`);
  return data;
};

export const createQuestion = async (payload: {
  title: string;
  body: string;
  authorName?: string;
}) => {
  const { data } = await api.post<Question>("/api/qa", payload);
  return data;
};

export const createAnswer = async (questionId: number, body: string) => {
  const { data } = await api.post<Answer>(`/api/qa/${questionId}/answers`, {
    body,
  });
  return data;
};
