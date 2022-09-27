// import { Omit } from "lodash";
import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import Session, { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import config from "config";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { getUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
}
export function createAccessToken({
  user,
  session,
}: {
  user:
    | Omit<UserDocument, "password">
    | LeanDocument<Omit<UserDocument, "password">>;
  session:
    | Omit<SessionDocument, "password">
    | LeanDocument<Omit<SessionDocument, "password">>;
}) {
  // Build and return the new access token
  const accessToken = signJwt(
    { userId: user._id, isAdmin: user.isAdmin, sessionId: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") } // 15 minutes
  );
  return accessToken;
}

// * REFRESH TOKEN
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // Decode the refresh token
  const { decoded } = verifyJwt(refreshToken);
  console.log(decoded);

  if (!decoded || !get(decoded, "sessionId")) return false;

  // Get the session
  const session = await Session.findById(get(decoded, "sessionId"));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await getUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
}

// *  UPDATE SESSION
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return Session.updateOne(query, update);
}
// * FIND SESSION
export async function findSessions(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean();
}
