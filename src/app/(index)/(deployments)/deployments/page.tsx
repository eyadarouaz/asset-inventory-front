"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DeploymentsTable from "@/components/tables/DeploymentsTable";
import React, { useEffect, useState } from "react";



export default function DeploymentsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="All Deployments" />
            <div className="space-y-6">
                <DeploymentsTable />
            </div>
        </div>
    );
}
