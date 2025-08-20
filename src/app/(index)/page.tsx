"use client";

import React from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

export default function Index() {
  const { hydrated, user } = useAuthGuard();
  const router = useRouter();

  if (!hydrated || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div>
      <Button size="md" onClick={() => router.push("/deployments")}>
        View Deployments
      </Button>
    </div>
  );
}
