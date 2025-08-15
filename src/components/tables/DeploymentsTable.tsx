import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";

export interface DeploymentJob {
    id: number;
    name: string;
    vm_name: string;
    cpu: number;
    memory: number; // in MB
    status: string;
    created_at: string;
}

interface DeploymentTableProps {
    deployments: DeploymentJob[];
}

export default function DeploymentsTable({ deployments }: DeploymentTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[700px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {[
                                    "Name",
                                    "VM Name",
                                    "CPU",
                                    "Memory (MB)",
                                    "Status",
                                    "Created At",
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
                            {deployments.map((d) => (
                                <TableRow key={d.id} className="hover:bg-gray-50">
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="block text-black-500 text-theme-xs dark:text-gray-400">
                                                    {d.name}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start"><div className="flex items-center gap-3">
                                            <div>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {d.vm_name}
                                                </span>
                                            </div>
                                        </div></TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {d.cpu}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {d.memory}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start capitalize">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {d.status}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {new Date(d.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
