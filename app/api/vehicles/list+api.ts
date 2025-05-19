import { auth } from "@/lib/auth/server";
import { jwtVerify, createLocalJWKSet } from "jose";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization");

  const { keys } = await auth.api.getJwks();

  const jwk = createLocalJWKSet({ keys });

  const { payload } = await jwtVerify(token || "", jwk);

  return Response.json({ hello: "world" });
}
