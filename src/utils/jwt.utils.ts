import jwt from "jsonwebtoken";
import config from "../config/default";
const privateKey = config.privateKey as string;
export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, options);
}
export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error: any) {
    // console.log({  error });
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
