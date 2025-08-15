"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import DisksTable from "@/components/tables/DisksTable";
import DatacentersTable from "@/components/tables/DatacentersTable";
import { useAuthStore } from "@/stores/useAuthStore";
import { createDatacenter, Datacenter, getAllDatacenters } from "@/services/asset";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import DatacenterModal from "@/components/modals/DatacenterModal";
import Alert from "@/components/ui/alert/Alert";

export default function Datacenters() {

  const [alertProps, setAlertProps] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    showLink?: boolean;
    linkHref?: string;
    linkText?: string;
  } | null>(null);
  const token = useAuthStore((state) => state.user?.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);

  useEffect(() => {
    const fetchDCs = async () => {
      try {
        if (!token) return;
        const res = await getAllDatacenters(token);
        setDatacenters(res.data);
      } catch (error) {
        console.error("Failed to load datacenters", error);
      }
    };
    fetchDCs();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreate = async (dcData: Partial<Datacenter>) => {
    if (!token) return;

    try {
      const payload = { ...dcData } as Omit<Datacenter, "id">;
      const res = await createDatacenter(token, payload);
      setAlertProps({
        variant: "success",
        title: "Datacenter Created",
        message: `"${res.data.name}" has been successfully added.`,
      });
    } catch (err) {
      setAlertProps({
        variant: "error",
        title: "Creation Failed",
        message: `${err}`,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage Datacenters" />
      {alertProps && (
        <div className="my-4">
          <Alert
            variant={alertProps.variant}
            title={alertProps.title}
            message={alertProps.message}
            showLink={alertProps.showLink}
            linkHref={alertProps.linkHref}
            linkText={alertProps.linkText}
            onClose={() => setAlertProps(null)}
          />
        </div>
      )}
      <div className="flex justify-end mb-6">
        <Button
          size="sm"
          variant="primary"
          startIcon={<PlusIcon />}
          onClick={handleOpenModal}
        >
          Add Datacenter
        </Button>
      </div>
      <div className="space-y-6">
        <DatacentersTable />
      </div>
      <DatacenterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode="create"
        onSubmit={handleCreate}
      />
    </div>
  );
}
