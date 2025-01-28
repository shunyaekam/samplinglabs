import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import { isAdmin } from "@/lib/utils/auth"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      // Add role to JWT token
      token.role = isAdmin(token.email) ? 'SUPER_ADMIN' : 'USER'
      return token
    },
    async session({ session, token }) {
      // Add role to session
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 