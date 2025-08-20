'use client';

import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "./Label";
import Input from "./input/InputField";
import Button from "../ui/button/Button";
import Select from "./Select";
import { CheckLineIcon, ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from "@/icons";
import { Datacenter, Cluster, Network } from "@/services/asset";
import { createDeploymentJob } from "@/services/deployment";
import { useAuthStore } from "@/stores/useAuthStore";
import Alert from "../ui/alert/Alert";

type FormData = {
    vmCount: number;
    datacenter?: number;
    cluster?: number;
    network?: number;
    diskSizeGB: number;
    cpu: number;
    memoryMB: number;
    autoApprove: boolean;
    datastore?: string; // Added based on your Terraform template
    vmNamePrefix?: string; // Added for VM naming
    vsphereUser?: string; // Provider fields from template
    vspherePassword?: string;
    vsphereServer?: string;
};

const initialData: FormData = {
    vmCount: 1,
    datacenter: undefined,
    cluster: undefined,
    network: undefined,
    diskSizeGB: 50,
    cpu: 2,
    memoryMB: 4096,
    autoApprove: false,
    datastore: "",
    vmNamePrefix: "",
};

type Props = {
    datacenters: Datacenter[];
    clusters: Cluster[];
    networks: Network[];
};

export function DeploymentJobForm({ datacenters, clusters, networks }: Props) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialData);
    const [alert, setAlert] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    const steps = [
        { title: "VM Config", description: "VM count, datacenter, cluster, network" },
        { title: "Resources", description: "CPU, memory, disk" },
        { title: "Terraform Options", description: "Terraform provider & apply options" },
        { title: "Review", description: "Check all info before deploy" },
    ];

    const filteredClusters = clusters.filter(c => c.datacenter === formData.datacenter);
    const filteredNetworks = networks.filter(n => n.datacenter === formData.datacenter);

    const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const back = () => setStep(s => Math.max(s - 1, 0));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setFormData(prev => ({ ...prev, [name]: type === "number" ? Number(val) : val }));
    };

    const handleSelectChange = (name: keyof FormData, value: number | undefined) => {
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === "datacenter") {
                updated.cluster = undefined;
                updated.network = undefined;
            }
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (!formData.datacenter || !formData.cluster || !formData.network) {
            setAlert({
                variant: "error",
                title: "Missing Configuration",
                message: "Datacenter, Cluster, and Network are required.",
            });
            return;
        }

        const token = useAuthStore.getState().user?.token;
        if (!token) {
            setAlert({
                variant: "error",
                title: "Authentication Required",
                message: "Please login to deploy VMs.",
            });

            return;
        }

        const vmNamePrefix = formData.vmNamePrefix || "vm";

        try {
            await createDeploymentJob(token, {
                name: `Deploy ${formData.vmNamePrefix}`,
                vm_name: vmNamePrefix,
                vm_count: formData.vmCount,
                cpu: formData.cpu,
                memory: formData.memoryMB,
                datastore: formData.datastore || "",
                datacenter: formData.datacenter,
                cluster: formData.cluster,
                network: formData.network,
            });

            setAlert({
                variant: "success",
                title: "Deployment Submitted",
                message: "Your deployment job was submitted successfully. Check logs for more details.",
            });

        } catch (err: any) {
            console.error("Deployment failed:", err);
            setAlert({
                variant: "error",
                title: "Deployment Failed",
                message: "Failed to create deployment jobs. Check logs for more details.",
            });

        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {alert && (
                <Alert
                    variant={alert.variant}
                    title={alert.title}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Stepper */}
            <ol className="flex space-x-6">
                {steps.map((s, i) => (
                    <li
                        key={i}
                        className={`flex items-center space-x-2 ${i === step ? "text-blue-600" : i < step ? "text-green-600" : "text-gray-400"
                            }`}
                    >
                        <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-current">
                            {i < step ? <CheckLineIcon /> : i + 1}
                        </span>
                        <div>
                            <h3 className="font-semibold text-sm">{s.title}</h3>
                            <p className="text-xs">{s.description}</p>
                        </div>
                    </li>
                ))}
            </ol>

            {/* Steps */}
            {step === 0 && (
                <ComponentCard title="VM Configuration" className="min-h-[400px]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <Label>Number of VMs</Label>
                            <Input
                                name="vmCount"
                                type="number"
                                value={formData.vmCount}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label>VM Name (Prefix if multiple)</Label>
                            <Input
                                name="vmNamePrefix"
                                type="text"
                                value={formData.vmNamePrefix}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label>Datacenter</Label>
                            <div className="relative">
                                <Select
                                    options={datacenters.map(dc => ({ value: dc.id, label: dc.name }))}
                                    placeholder="Select datacenter"
                                    value={formData.datacenter ?? ""}
                                    onChange={val => handleSelectChange("datacenter", Number(val))}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Cluster</Label>
                            <div className="relative">
                                <Select
                                    options={filteredClusters.map(c => ({ value: c.id, label: c.name }))}
                                    placeholder="Select cluster"
                                    value={formData.cluster ?? ""}
                                    onChange={val => handleSelectChange("cluster", Number(val))}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Network</Label>
                            <div className="relative">
                                <Select
                                    options={filteredNetworks.map(n => ({ value: n.id, label: `${n.name} (${n.cidr})` }))}
                                    placeholder="Select network"
                                    value={formData.network ?? ""}
                                    onChange={val => handleSelectChange("network", Number(val))}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Datastore</Label>
                            <Input
                                name="datastore"
                                type="text"
                                value={formData.datastore}
                                onChange={handleInputChange}
                                placeholder="Datastore name"
                            />
                        </div>
                    </div>
                </ComponentCard>
            )}

            {step === 1 && (
                <ComponentCard title="Resources Configuration" className="min-h-[400px]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <Label>CPU cores</Label>
                            <Input
                                name="cpu"
                                type="number"
                                value={formData.cpu}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label>Memory (MB)</Label>
                            <Input
                                name="memoryMB"
                                type="number"
                                value={formData.memoryMB}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label>Disk size (GB)</Label>
                            <Input
                                name="diskSizeGB"
                                type="number"
                                value={formData.diskSizeGB}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* You can add other resource-related fields here */}
                    </div>
                </ComponentCard>
            )}

            {step === 2 && (
                <ComponentCard title="Terraform Provider & Options" className="min-h-[400px]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="flex items-center space-x-2 mt-6">
                            <input
                                type="checkbox"
                                id="autoApprove"
                                name="autoApprove"
                                checked={formData.autoApprove}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="autoApprove">Auto-approve Terraform apply</label>
                        </div>
                    </div>
                </ComponentCard>
            )}

            {step === 3 && (
                <ComponentCard title="Review Deployment" className="min-h-[400px]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <p>
                            <strong># VMs:</strong> {formData.vmCount}
                        </p>
                        <p>
                            <strong>VM Name Prefix:</strong> {formData.vmNamePrefix || "-"}
                        </p>
                        <p>
                            <strong>Datacenter:</strong> {datacenters.find(d => d.id === formData.datacenter)?.name || "-"}
                        </p>
                        <p>
                            <strong>Cluster:</strong> {clusters.find(c => c.id === formData.cluster)?.name || "-"}
                        </p>
                        <p>
                            <strong>Network:</strong> {networks.find(n => n.id === formData.network)?.name || "-"}
                        </p>
                        <p>
                            <strong>Datastore:</strong> {formData.datastore || "-"}
                        </p>
                        <p>
                            <strong>Disk (GB):</strong> {formData.diskSizeGB}
                        </p>
                        <p>
                            <strong>CPU cores:</strong> {formData.cpu}
                        </p>
                        <p>
                            <strong>Memory (MB):</strong> {formData.memoryMB}
                        </p>
                        <p>
                            <strong>Auto-approve:</strong> {formData.autoApprove ? "Yes" : "No"}
                        </p>
                    </div>
                </ComponentCard>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                <Button onClick={back} disabled={step === 0} size="sm" variant="outline">
                    Back
                </Button>
                {step < steps.length - 1 ? (
                    <Button onClick={next} size="sm" variant="primary">
                        Next
                    </Button>
                ) : (
                    <Button type="button" onClick={handleSubmit} size="sm" variant="primary">
                        Deploy
                    </Button>
                )}
            </div>
        </div>
    );
}
