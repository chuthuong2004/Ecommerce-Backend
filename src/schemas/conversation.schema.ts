import { object, string } from "yup";
const payload = {
  body: object({
    receiverId: string().required("receiverId is required"),
  }),
};
const params = {
  params: object({
    conversationId: string().required("conversationId is required"),
  }),
};
export const createConversationSchema = object({
  ...payload,
});

export const updateConversationSchema = object({
  ...params,
});
