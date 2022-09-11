import { object, string, ref } from "yup";
export const createUserSchema = object({
  body: object({
    username: string().required("Username is required"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minium.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters"),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Password must match"
    ),
    email: string()
      .email("Must be a valid email address")
      .required("Email is required"),
  }),
});
export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minium")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters"),
    email: string()
      .email("Must be a valid email address")
      .required("Email is required"),
  }),
});
