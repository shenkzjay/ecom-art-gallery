import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { createCookieSessionStorage, createCookie } from "react-router";
import { ROLE_LIST } from "~/server/configs/role";

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

const SALT_ROUND = 10;

export type SessionData = {
  _id: string;
  expires: string;
  roles: number[];
  lastActivity?: string;
};

interface User {
  _id: string;
  email: string;
  passwordHash: string | null;
  roles: number[];
}

type UploadPayload = {
  uploadPayload: {
    fileName: string;
    useUniqueFileName: string;
    tags: string;
  };
  expire: number;
  publicKey: string;
};

const sessionCookie = createCookie("usersession", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60, // 24 hours
  secrets: [process.env.AUTH_SECRET!],
});

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUND);
}

export async function comparePassword(plainTextPassword: string, hashedPassword: string) {
  return compare(plainTextPassword, hashedPassword);
}

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload as SessionData;
}

export async function getSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await sessionCookie.parse(cookieHeader);

  if (!session) return null;

  const sessionData = await verifyToken(session);

  if (!sessionData || new Date(sessionData.expires) < new Date()) {
    return null;
  }

  return sessionData;
}

export async function setSession(user: User) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const session: SessionData = {
    _id: user._id!,
    expires: expiresInOneDay.toISOString(),
    roles: user.roles || [ROLE_LIST.buyer],
    lastActivity: new Date().toISOString(),
  };

  const encryptedSession = await signToken(session);

  const cookie = await sessionCookie.serialize(encryptedSession, {
    expires: expiresInOneDay,
  });

  return cookie;
}

export async function clearSession() {
  const clearedCookie = await sessionCookie.serialize("", {
    maxAge: 0,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  });

  return clearedCookie;
}

// export async function getImageKitToken(
//   privateKey: string,
//   publicKey: string,
//   payload: UploadPayload
// ) {
//   const privatekey = new TextEncoder().encode(privateKey);

//   return await new SignJWT(payload.uploadPayload)
//     .setProtectedHeader({
//       alg: "HS256",
//       typ: "JWT",
//       kid: publicKey,
//     })
//     .setIssuedAt()
//     .setExpirationTime("1 day from now")
//     .sign(privatekey);
// }
