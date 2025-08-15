"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import MaintenanceRecordsTable from "@/components/tables/MaintenanceTable";
import MaintenanceRecordModal from "@/components/modals/MaintenanceModal";

import { useAuthStore } from "@/stores/useAuthStore";
import {
  getDatacenterById,
  getRecordsByDatacenter,
  MaintenanceRecord,
  Datacenter,
  createMaintenanceRecord,
  MaintenanceResource,
  getResourcesByDatacenter,
} from "@/services/asset";
import Alert from "@/components/ui/alert/Alert";

export default function MaintenanceRecordsPage() {

  const [alertProps, setAlertProps] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    showLink?: boolean;
    linkHref?: string;
    linkText?: string;
  } | null>(null);
  const { dc_id } = useParams();
  const token = useAuthStore((state) => state.user?.token);
  const [resources, setResources] = useState<MaintenanceResource[]>([]);
  const [datacenter, setDatacenter] = useState<Datacenter | null>(null);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token || !dc_id) return;

    const dcIdNum = Number(dc_id);
    if (isNaN(dcIdNum)) {
      console.error("Invalid datacenter id in route:", dc_id);
      return;
    }

    (async () => {
      try {
        const dcResponse = await getDatacenterById(token, dcIdNum);
        setDatacenter(dcResponse.data);

        const recResponse = await getRecordsByDatacenter(token, dcIdNum);
        setRecords(recResponse.data);

        const resResponse = await getResourcesByDatacenter(token, dcIdNum);
        setResources(resResponse.data);
      } catch (error) {
        console.error("Failed to load datacenter or maintenance records", error);
      }
    })();


  }, [token, dc_id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreate = async (mrData: Partial<MaintenanceRecord>) => {
    if (!token) return;

    try {
      const payload = {
        ...mrData,
        datacenter: datacenter?.id ?? 0,
      } as {
        title: string;
        description: string;
        performed_at: Date | string;
        datacenter: number;
        content_type: number;
        object_id: number;
      };

      const res = await createMaintenanceRecord(token, payload);
      setAlertProps({
        variant: "success",
        title: "Server Created",
        message: `"${res.data.title}" has been successfully added.`,
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


  if (!token) return <p>Please login to see maintenance records.</p>;
  if (!dc_id) return <p>Datacenter ID is missing in URL.</p>;

  return (
    <div>
      <PageBreadcrumb
        pageTitle={`Maintenance Records for ${datacenter?.name ?? dc_id} `}
        middleBreadcrumbs={[{ label: "Manage Datacenters", href: "/datacenters" }]}
      />

      <div className="flex justify-end mb-6">
        <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={handleOpenModal}>
          Add Record
        </Button>
      </div>
      
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

      <div className="space-y-6">
        {datacenter ? (
          <MaintenanceRecordsTable datacenterId={datacenter.id} />
        ) : (
          <p>Loading records...</p>
        )}
      </div>

      <MaintenanceRecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode="create"
        onSubmit={handleCreate}
        resources={resources}
      />
    </div>
  );
}
