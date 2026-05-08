import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Acesso Administrativo",
      credentials: {
        email: { label: "E-mail Admin", type: "email", placeholder: "admin@loja.com" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Retorna um objeto de usuário estático que representa o Admin
          return { id: "admin", name: "Administrador", email: credentials.email as string, role: "admin" }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.role) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})
