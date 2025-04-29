import { auth } from "@/lib/auth/server";

const handler = auth.handler;

export { handler as GET, handler as POST }; // export handler for both GET and POST requests
