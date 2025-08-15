'use client';

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DisksTable from "@/components/tables/DisksTable";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { Datacenter, getAllDatacenters, Disk, createDisk } from "@/services/asset";
import { useAuthStore } from "@/stores/useAuthStore";
import DiskModal from "@/components/modals/DiskModal";
import Alert from "@/components/ui/alert/Alert";

export default function Disks() {

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

  const handleCreate = async (diskData: Partial<Disk>) => {
    if (!token) return;

    try {
      const payload = { ...diskData } as Omit<Disk, "id">;
      const res = await createDisk(token, payload);
      setAlertProps({
        variant: "success",
        title: "Disk Array Created",
        message: `"${res.data.serial_number}" has been successfully added.`,
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
      <PageBreadcrumb pageTitle="Manage Disk Arrays" />
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
          Add Disk
        </Button>
      </div>
      <div className="space-y-6">
        <DisksTable />
      </div>
      <DiskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode="create"
        datacenters={datacenters}
        onSubmit={handleCreate}
      />
    </div>
  );
}
