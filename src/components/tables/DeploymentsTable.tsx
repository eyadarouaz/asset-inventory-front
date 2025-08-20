"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";
import axios from "@/utils/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { Modal } from "../ui/modal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DeploymentJob {
    id: number;
    name: string;
    vm_name: string;
    vm_count: number;
    cpu: number;
    memory: number;
    status: string;
    created_at: string;
}

export default function DeploymentsTable() {
    const [deployments, setDeployments] = useState<DeploymentJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [logModalJob, setLogModalJob] = useState<DeploymentJob | null>(null);
    const [logs, setLogs] = useState<string | null>(null);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const token = useAuthStore.getState().user?.token;

    useEffect(() => {
        const fetchDeployments = async () => {
            try {
                const res = await axios.get(`${API_URL}/deployments/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDeployments(res.data);
            } catch (err) {
                console.error("Failed to fetch deployments", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeployments();
    }, [token]);

    const handleViewLogs = async (job: DeploymentJob) => {
        setLogModalJob(job);
        setLoadingLogs(true);
        setLogs(null);

        try {
            const res = await axios.get(`${API_URL}/deployments/${job.id}/logs/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLogs(res.data.logs || "No logs found.");
        } catch (err) {
            console.error("Failed to fetch logs", err);
            setLogs("Error fetching logs.");
        } finally {
            setLoadingLogs(false);
        }
    };

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[900px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {[
                                        "Name",
                                        "VMs Count",
                                        "CPU",
                                        "Memory (MB)",
                                        "Status",
                                        "Created At",
                                        "Actions",
                                    ].map((col) => (
                                        <TableCell
                                            key={col}
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading ? (
                                    <TableRow>
                                        <TableCell className="px-5 py-4 text-center">
                                            <div className="flex items-center gap-3 justify-center">
                                                <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                    Loading deployments...
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : deployments.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="px-5 py-4 text-center">
                                            <div className="flex items-center gap-3 justify-center">
                                                <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                    No deployments found
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deployments.map((d) => (
                                        <TableRow key={d.id} className="hover:bg-gray-50">
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                            {d.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                            {d.vm_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                            {d.cpu}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                            {d.memory}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 capitalize">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                            {d.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                            {new Date(d.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <button
                                                    onClick={() => handleViewLogs(d)}
                                                    className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-400 lg:inline-flex lg:w-auto"
                                                >
                                                    View Logs
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Logs Modal */}
            <Modal
                isOpen={!!logModalJob}
                onClose={() => setLogModalJob(null)}
                className="max-w-2xl p-6"
            >
                <h2 className="text-lg font-bold mb-4">
                    Logs for Job #{logModalJob?.id} — {logModalJob?.vm_name}
                </h2>
                {loadingLogs ? (
                    <p className="text-gray-600 dark:text-gray-300">Loading logs...</p>
                ) : (
                    <pre className="whitespace-pre-wrap text-sm max-h-[500px] overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 rounded text-gray-800 dark:text-gray-200">
                        {logs}
                    </pre>
                )}
            </Modal>
        </>
    );
}
