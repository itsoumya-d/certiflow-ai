import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Demo users - in production, these would come from a database
const users = [
    {
        id: "1",
        name: "Soumya Debnath",
        email: "soumya@certiflow.ai",
        password: bcrypt.hashSync("demo123", 10),
        role: "admin",
        organization: "Demo Company",
    },
    {
        id: "2",
        name: "Demo User",
        email: "demo@certiflow.ai",
        password: bcrypt.hashSync("demo123", 10),
        role: "user",
        organization: "Demo Company",
    },
    {
        id: "3",
        name: "Auditor",
        email: "auditor@certiflow.ai",
        password: bcrypt.hashSync("demo123", 10),
        role: "auditor",
        organization: "Audit Firm",
    },
];

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = users.find((u) => u.email === credentials.email);

                if (!user) {
                    return null;
                }

                const isPasswordValid = bcrypt.compareSync(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    organization: user.organization,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.organization = user.organization;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as unknown as Record<string, unknown>).role = token.role;
                (session.user as unknown as Record<string, unknown>).organization = token.organization;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET || "certiflow-ai-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
