import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter" // Note: v4 adapter usage, strictly we use callbacks for credentials
// import prisma from "@/lib/prisma" // Commented out until prisma generate works to avoid build error in editor

// Mock user for initial testing since we don't have a populated DB yet
const mockUsers = [
    { id: "1", email: "student@school.com", password: "123", role: "STUDENT", name: "Juan Perez" },
    { id: "2", email: "teacher@school.com", password: "123", role: "TEACHER", name: "Prof. Jirafales" },
    { id: "3", email: "admin@school.com", password: "123", role: "ADMIN", name: "Director Skinner" },
    { id: "4", email: "dev@school.com", password: "123", role: "DEV", name: "Neo" },
]

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@school.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // In real app: Fetch user from DB and compare hash
                // const user = await prisma.user.findUnique(...)

                const user = mockUsers.find(u => u.email === credentials?.email && u.password === credentials?.password)

                if (user) {
                    return { id: user.id, email: user.email, name: user.name, role: user.role }
                }
                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.role = token.role
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt" // Required for Credentials provider
    }
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
