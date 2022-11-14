import { object, string } from "yup";
const payload = {
  body: object({
    sender: string().required("sender is required"),
    conversation: string().required("conversation is required"),
  }),
};
const params = {
  params: object({
    conversationId: string().required("conversationId is required"),
  }),
};
export const createMessageSchema = object({
  ...payload,
});
export const getMessageSchema = object({
  ...params,
});
export const updateMessageSchema = object({
  params: object({
    receiverId: string().required("receiverId is required"),
    conversationId: string().required("conversationId is required"),
  }),
});
