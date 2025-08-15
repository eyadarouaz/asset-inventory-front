'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';

import { useAuthStore } from '@/stores/useAuthStore';
import { useModal } from '@/hooks/useModal';
import DatacenterModal from '../modals/DatacenterModal';

import {
    Datacenter,
    deleteDatacenter,
    getAllDatacenters,
    updateDatacenter,
} from '@/services/asset';
import Link from 'next/link';
import Alert from '../ui/alert/Alert';

export default function DatacentersTable() {
    const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
    const [selectedDatacenter, setSelectedDatacenter] = useState<Datacenter | null>(null);

    const { isOpen, openModal, closeModal } = useModal();
    const token = useAuthStore.getState().user?.token;

    const [alert, setAlert] = useState<{
        type: "success" | "error";
        title: string;
        message: string;
    } | null>(null);

    useEffect(() => {
        const token = useAuthStore.getState().user?.token;
        if (!token) return;

        getAllDatacenters(token)
            .then(res => {
                setDatacenters(res.data || []);
            })
            .catch(err => console.error(err));
    }, []);

    const openEdit = (dc: Datacenter) => {
        setSelectedDatacenter(dc);
        openModal();
    };

    const createPatchPayload = (
        edited: Partial<Datacenter>,
        original: Datacenter
    ): Partial<Datacenter> => {
        const payload: Partial<Datacenter> = {};
        (Object.keys(edited) as (keyof Datacenter)[]).forEach(key => {
            const newVal = edited[key];
            const oldVal = original[key];
            if (newVal !== undefined && newVal !== null && newVal !== oldVal) {
                payload[key] = newVal as any;
            }
        });
        return payload;
    };

    const handleSubmit = async (data: Partial<Datacenter>) => {
        if (!selectedDatacenter) return;
        if (!token) return;

        const patch = createPatchPayload(data, selectedDatacenter);
        if (!Object.keys(patch).length) return;

        console.log(patch);

        try {
            await updateDatacenter(token, selectedDatacenter.id, patch);
            const resp = await getAllDatacenters(token);
            setDatacenters(resp.data);
            closeModal();
            setAlert({
                type: "success",
                title: "Datacenter Updated",
                message: `"${selectedDatacenter.name}" datacenter was successfully updated.`,
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
        if (!token || selectedDatacenter === null) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to permanently delete this record?`
        );

        if (!confirmDelete) return;

        try {
            await deleteDatacenter(token, selectedDatacenter.id);
            closeModal();
            setAlert({
                type: "success",
                title: "Datacenter Deleted",
                message: `"${selectedDatacenter.name}" datacenter was successfully deleted.`,
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
                                        'ID',
                                        'Name',
                                        'Location',
                                        'Servers',
                                        'Disk Arrays',
                                    ].map(col => (
                                        <TableCell key={col} isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {datacenters.map(dc => (
                                    <TableRow key={dc.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                        {dc.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {dc.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {dc.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        67
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        21
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => {
                                                    openEdit(dc)
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
                                        <TableCell>
                                            <Link
                                                href={`/datacenters/maintenance/${dc.id}`}
                                                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-400 lg:inline-flex lg:w-auto"
                                            >
                                                Maintenance Record
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DatacenterModal
                        isOpen={isOpen}
                        onClose={closeModal}
                        mode="edit"
                        initialData={selectedDatacenter || undefined}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </div >
            </div>
        </div>
    );
}
