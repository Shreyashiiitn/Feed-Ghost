import NextAuth from "next-auth/next";
import { authOptions } from "./options";
import nextAuth from "next-auth";

const handler = NextAuth(authOptions)


export {handler as GET , handler as POST}