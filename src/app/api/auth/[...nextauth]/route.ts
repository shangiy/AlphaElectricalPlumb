import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the id_token to the JWT so it can be accessed in the session
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Send the id_token to the client so the AuthProvider can sync it with Supabase
      session.id_token = token.id_token;
      return session;
    },
  },
  // Ensure trust for proxies (required for custom domains on cloud platforms)
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
