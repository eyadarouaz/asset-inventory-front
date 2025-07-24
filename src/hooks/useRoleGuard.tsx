import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export const useRoleGuard = (allowedRoles: string[]) => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const hydrated = useAuthStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated) return;

        if (!user) {
            router.replace("/signin");
            return;
        }
    }, [user, allowedRoles, router]);

    return { hydrated, user };
};
