

declare module "next-auth" {
    interface User {
        role?: string;
        organization?: string;
    }

    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
            organization?: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        organization?: string;
    }
}
