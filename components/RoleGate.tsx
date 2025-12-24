"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

type Role = "admin" | "user" | "auditor";

interface RoleGateProps {
    children: ReactNode;
    allowedRoles: Role[];
    fallback?: ReactNode;
}

/**
 * Role-based access control component
 * Renders children only if user has one of the allowed roles
 */
export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
    const { data: session } = useSession();

    const userRole = (session?.user as unknown as { role?: string })?.role as Role | undefined;

    if (!session || !userRole) {
        return <>{fallback}</>;
    }

    if (!allowedRoles.includes(userRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Hook to check if current user has specific role(s)
 */
export function useRole() {
    const { data: session, status } = useSession();
    const userRole = (session?.user as unknown as { role?: string })?.role;

    return {
        role: userRole,
        isAdmin: userRole === "admin",
        isUser: userRole === "user",
        isAuditor: userRole === "auditor",
        isLoading: status === "loading",
        isAuthenticated: !!session,
        hasRole: (roles: Role[]) => roles.includes(userRole as Role),
    };
}

/**
 * Component that only renders for admins
 */
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <RoleGate allowedRoles={["admin"]} fallback={fallback}>
            {children}
        </RoleGate>
    );
}

/**
 * Component that hides content from auditors (read-only users)
 */
export function HideFromAuditor({ children }: { children: ReactNode }) {
    return <RoleGate allowedRoles={["admin", "user"]}>{children}</RoleGate>;
}

/**
 * Badge showing current user's role
 */
export function RoleBadge() {
    const { role, isLoading } = useRole();

    if (isLoading || !role) return null;

    const roleConfig: Record<string, { label: string; className: string }> = {
        admin: { label: "Admin", className: "badge-success" },
        user: { label: "User", className: "badge-info" },
        auditor: { label: "Auditor", className: "badge-warning" },
    };

    const config = roleConfig[role] || { label: role, className: "" };

    return <span className={`badge ${config.className}`}>{config.label}</span>;
}
