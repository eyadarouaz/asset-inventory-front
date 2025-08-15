"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { createUser, getAllUsers, User } from "@/services/user";
import UsersTable from "@/components/tables/UsersTable";
import UserModal from "@/components/modals/UserModal";
import Alert from "@/components/ui/alert/Alert";
import DeploymentsTable, { DeploymentJob } from "@/components/tables/DeploymentsTable";

export default function DeploymentsPage() {
    const staticDeployments: DeploymentJob[] = [
        {
            id: 1,
            name: "Deploy App 1",
            vm_name: "vm-app-1",
            cpu: 4,
            memory: 8192,
            status: "running",
            created_at: "2025-08-01T10:00:00Z",
        },
        {
            id: 2,
            name: "Deploy DB",
            vm_name: "vm-db-1",
            cpu: 2,
            memory: 4096,
            status: "pending",
            created_at: "2025-08-05T12:30:00Z",
        },
    ];
    return (
        <div>
            <PageBreadcrumb pageTitle="All Deployments" />
            <div className="space-y-6">
                <DeploymentsTable deployments={staticDeployments} />
            </div>
        </div>
    );
}
