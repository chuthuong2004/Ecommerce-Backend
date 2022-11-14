import { object, string } from "yup";
const payload = {
  body: object({
    receiverId: string().required("receiverId is required"),
  }),
};

export const createConversationSchema = object({
  ...payload,
});
