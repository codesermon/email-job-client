import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./schema";
import { ZodError } from "zod";
import { apiUrl } from "./config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await SignInSchema.parseAsync(
            credentials
          );

          const res = await fetch(`${apiUrl}/api/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, email }),
          });
          const user = await res.json();

          console.log(user);

          if (!res.ok || !user) {
            throw new Error("Invalid credentials.");
          }
          // return JSON object with the user data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
          throw error
        }
      },

    }),

  ],
  callbacks: {
    redirect: (params: {
        url: string;
        baseUrl: string;
    }) => {
        return params.baseUrl
    }
  },
  pages: {
    signIn: "/auth",
  },
});
