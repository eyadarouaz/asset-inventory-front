"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DeploymentJobForm } from "@/components/form/DeploymentJobForm";
import React, { useEffect, useState } from "react";

export default function DeployPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Deployment Job" />
            <div className="space-y-6">
                <DeploymentJobForm />
            </div>
        </div>
    );
}
