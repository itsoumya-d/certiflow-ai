import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        role?: string;
        organization?: string;
    }

    interface Session {
        user: {
            id?: string;
            role?: string;
            organization?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        organization?: string;
    }
}
