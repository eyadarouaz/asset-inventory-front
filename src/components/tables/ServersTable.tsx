'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';

import { useAuthStore } from '@/stores/useAuthStore';
import { useModal } from '@/hooks/useModal';
import ServerModal from '../modals/ServerModal';

import {
  Server,
  Datacenter,
  updateServer,
  deleteServer,
  Cluster,
  Network,
} from '@/services/asset';
import { assetStatusLabels } from '@/services/asset';
import Alert from '../ui/alert/Alert';

type ServersTableProps = {
  servers: Server[];
  datacenters: Datacenter[];
  clusters: Cluster[];
  networks: Network[];
  refreshServers: () => Promise<void>;
};

export default function ServersTable({ servers, datacenters, clusters, networks, refreshServers }: ServersTableProps) {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const token = useAuthStore.getState().user?.token;

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const openEdit = (server: Server) => {
    setSelectedServer(server);
    openModal();
  };

  const createPatchPayload = (
    edited: Partial<Server>,
    original: Server
  ): Partial<Server> => {
    const payload: Partial<Server> = {};
    (Object.keys(edited) as (keyof Server)[]).forEach(key => {
      const newVal = edited[key];
      const oldVal = original[key];
      if (newVal !== undefined && newVal !== null && newVal !== oldVal) {
        payload[key] = newVal as any;
      }
    });
    return payload;
  };

  const handleSubmit = async (data: Partial<Server>) => {
    if (!selectedServer) return;
    if (!token) return;

    const patch = createPatchPayload(data, selectedServer);
    if (!Object.keys(patch).length) return;

    try {
      await updateServer(token, selectedServer.id, patch);
      await refreshServers();  // refresh server list from parent
      closeModal();
      setAlert({
        type: "success",
        title: "Server Updated",
        message: `"${selectedServer.serial_number}" was successfully updated.`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to update. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!token || selectedServer === null) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${selectedServer.serial_number}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteServer(token, selectedServer.id);
      await refreshServers();
      closeModal();
      setAlert({
        type: "success",
        title: "Server Deleted",
        message: `"${selectedServer.serial_number}" was successfully deleted.`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to delete. Please try again.",
      });
    }
  };



  return (
    <div>
      {alert && (
        <div className="mb-4">
          <Alert
            variant={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    'Serial No.',
                    'Model',
                    'Manufacturer',
                    'Status',
                    'CPU',
                    'RAM',
                    'Storage',
                    'IP Address',
                    'DC',
                  ].map(col => (
                    <TableCell key={col} isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {servers.map(srv => (
                  <TableRow key={srv.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                            {srv.serial_number}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {srv.model}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {srv.manufacturer}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <Badge
                        size="sm"
                        color={
                          srv.status === 'available'
                            ? 'success'
                            : srv.status === 'maintenance'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {assetStatusLabels[srv.status] || srv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                            {srv.cpu} cores
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                            {srv.ram} GB
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                            {srv.storage} GB
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                            {srv.ip_address}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                          {datacenters.find(dc => dc.id === srv.datacenter)?.name || '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          openEdit(srv)
                        }}
                        className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-400 lg:inline-flex lg:w-auto"
                      >
                        <svg
                          className="fill-current"
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill=""
                          />
                        </svg>
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ServerModal
            isOpen={isOpen}
            onClose={closeModal}
            mode="edit"
            datacenters={datacenters}
            clusters={clusters}
            networks={networks}
            initialData={selectedServer || undefined}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        </div >
      </div>
    </div>
  );
}
