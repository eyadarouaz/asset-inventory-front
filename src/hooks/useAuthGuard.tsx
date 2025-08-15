import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthGuard = () => {
    const user = useAuthStore((state) => state.user);
    const hydrated = useAuthStore((state) => state.hydrated);
    const router = useRouter();

    useEffect(() => {
        if (hydrated && !user) {
            router.replace('/signin');
        }
    }, [hydrated, user, router]);

    return { user, hydrated };
};
