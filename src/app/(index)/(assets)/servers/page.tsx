'use client';

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ServersTable from "@/components/tables/ServersTable";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import ServerModal from "@/components/modals/ServerModal";
import { Cluster, createServer, Datacenter, getAllClusters, getAllDatacenters, getAllNetworks, getAllServers, Network, Server } from "@/services/asset";
import { useAuthStore } from "@/stores/useAuthStore";
import Alert from "@/components/ui/alert/Alert";
import { useModal } from "@/hooks/useModal";

export default function Servers() {
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
  const [servers, setServers] = useState<Server[]>([]);
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const { isOpen, openModal, closeModal } = useModal();

  const fetchServers = async () => {
    if (!token) return;
    try {
      const srvRes = await getAllServers(token);
      setServers(srvRes.data || []);
    } catch (error) {
      console.error("Failed to load servers", error);
    }
  };

  const fetchDatacenters = async () => {
    if (!token) return;
    try {
      const dcRes = await getAllDatacenters(token);
      console.log(dcRes)
      setDatacenters(dcRes.data || []);
    } catch (error) {
      console.error("Failed to load datacenters", error);
    }
  };

  const fetchClusters = async () => {
    if (!token) return;
    try {
      const clRes = await getAllClusters(token);
      setClusters(clRes.data || []);
    } catch (error) {
      console.error("Failed to load clusters", error);
    }
  };

  const fetchNetworks = async () => {
    if (!token) return;
    try {
      const netRes = await getAllNetworks(token);
      console.log("Networks:", netRes);
      setNetworks(netRes.data || []);
    } catch (error) {
      console.error("Failed to load networks", error);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchServers();
    fetchDatacenters();
    fetchClusters();
    fetchNetworks();
  }, [token]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreate = async (serverData: Partial<Server>) => {
    if (!token) return;

    try {
      const payload = { ...serverData } as Omit<Server, "id">;
      const res = await createServer(token, payload);
      setAlertProps({
        variant: "success",
        title: "Server Created",
        message: `"${res.data.serial_number}" has been successfully added.`,
      });
      await fetchServers(); // refresh servers after create
      closeModal();
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
      <PageBreadcrumb pageTitle="Manage Servers" />
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
          Add Server
        </Button>
      </div>
      <div className="space-y-6">
        <ServersTable
          servers={servers}
          datacenters={datacenters}
          clusters={clusters}
          networks={networks}
          refreshServers={fetchServers}
        />
      </div>
      <ServerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode="create"
        datacenters={datacenters}
        clusters={clusters}
        networks={networks}
        onSubmit={handleCreate}
      />
    </div>
  );
}
