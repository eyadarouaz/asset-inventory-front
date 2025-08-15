// components/DeploymentJobForm.tsx
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "./Label";
import Input from "./input/InputField";
import Button from "../ui/button/Button";
import Select from "./Select";  // <-- Import your custom Select component
import { CheckLineIcon, ChevronDownIcon } from "@/icons";

type FormData = {
    vmCount: number;
    datacenter: string;
    server: string;
    diskSizeGB: number;
    cpu: number;
    memoryMB: number;
    autoApprove: boolean;
};

const initialData: FormData = {
    vmCount: 1,
    datacenter: "",
    server: "",
    diskSizeGB: 50,
    cpu: 2,
    memoryMB: 4096,
    autoApprove: false,
};

const datacenterOptions = [
    { value: "dc1", label: "EO" },
    { value: "dc2", label: "TT" },
    { value: "dc3", label: "DX" },
];

const serverOptions = [
    { value: "server1", label: "Server 1" },
    { value: "server2", label: "Server 2" },
    { value: "server3", label: "Server 3" },
];

export function DeploymentJobForm() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialData);

    const steps = [
        { title: "VM Config", description: "VM count, datacenter, server, disks" },
        { title: "Resources", description: "CPU and memory" },
        { title: "Terraform Options", description: "Approve Terraform apply" },
        { title: "Review", description: "Check all info before deploy" },
    ];

    const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
        }));
    };

    // For Select, onChange passes value directly
    const handleSelectChange = (name: keyof FormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        console.log("Deploying with data:", formData);
        alert("Terraform deployment triggered!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Stepper */}
            <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                {steps.map((s, i) => (
                    <li
                        key={i}
                        className={`flex items-center space-x-2.5 rtl:space-x-reverse ${i === step
                            ? "text-blue-600"
                            : i < step
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                    >
                        <span
                            className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${i === step
                                ? "border-blue-600 text-blue-600"
                                : i < step
                                    ? "border-green-600 text-green-600"
                                    : "border-gray-400 text-gray-400"
                                }`}
                        >
                            {i < step ? <CheckLineIcon /> : i + 1}
                        </span>
                        <span>
                            <h3 className="text-sm text-primary-500 dark:text-primary-400 sm:text-base">{s.title}</h3>
                            <p className="text-xs">{s.description}</p>
                        </span>
                    </li>
                ))}
            </ol>

            {/* Form content based on current step */}

            {/* Step 0: VM Config */}
            {step === 0 && (
                <ComponentCard title="VM Configuration">
                    <div className="space-y-6">
                        <div>
                            <Label>Number of VMs to deploy</Label>
                            <Input
                                type="number"
                                name="vmCount"
                                value={formData.vmCount}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Datacenter</Label>
                            <div className="relative">
                                <Select
                                    options={datacenterOptions}
                                    placeholder="Select datacenter"
                                    value={formData.datacenter}
                                    onChange={(val) => handleSelectChange("datacenter", val)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Server / Host</Label>
                            <div className="relative">
                                <Select
                                    options={serverOptions}
                                    placeholder="Select server"
                                    value={formData.server}
                                    onChange={(val) => handleSelectChange("server", val)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Disk size (GB)</Label>
                            <Input
                                type="number"
                                name="diskSizeGB"
                                value={formData.diskSizeGB}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </ComponentCard>
            )}

            {/* Step 1: Resources (CPU, Memory) */}
            {step === 1 && (
                <ComponentCard title="Resources Configuration">
                    <div className="space-y-6">
                        <div>
                            <Label>CPU cores</Label>
                            <Input
                                type="number"
                                name="cpu"
                                value={formData.cpu}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label>Memory (MB)</Label>
                            <Input
                                type="number"
                                name="memoryMB"
                                value={formData.memoryMB}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </ComponentCard>
            )}

            {/* Step 2: Terraform Options */}
            {step === 2 && (
                <ComponentCard title="Terraform Options">
                    <div className="space-y-6">
                        <label className="flex items-center space-x-2 rtl:space-x-reverse">
                            <input
                                type="checkbox"
                                name="autoApprove"
                                checked={formData.autoApprove}
                                onChange={handleChange}
                            />
                            <span>Auto-approve Terraform apply</span>
                        </label>
                    </div>
                </ComponentCard>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
                <ComponentCard title="Review Deployment">
                    <div className="space-y-3 text-gray-800 dark:text-gray-200 text-sm">
                        <p><strong>Number of VMs:</strong> {formData.vmCount}</p>
                        <p><strong>Datacenter:</strong> {formData.datacenter || "-"}</p>
                        <p><strong>Server / Host:</strong> {formData.server || "-"}</p>
                        <p><strong>Disk Size (GB):</strong> {formData.diskSizeGB}</p>
                        <p><strong>CPU Cores:</strong> {formData.cpu}</p>
                        <p><strong>Memory (MB):</strong> {formData.memoryMB}</p>
                        <p><strong>Auto-approve:</strong> {formData.autoApprove ? "Yes" : "No"}</p>
                    </div>
                </ComponentCard>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                <Button
                    onClick={back}
                    disabled={step === 0}
                    size="sm"
                    variant="outline"
                >
                    Back
                </Button>

                {step < steps.length - 1 ? (
                    <Button
                        onClick={next}
                        size="sm"
                        variant="primary"
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        size="sm"
                        variant="primary"
                    >
                        Deploy
                    </Button>
                )}
            </div>
        </div>
    );
}
