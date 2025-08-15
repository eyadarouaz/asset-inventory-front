'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { MaintenanceRecord, MaintenanceResource } from '@/services/asset';
import DatePicker from '../form/date-picker';
import TextArea from '../form/input/TextArea';
import { ChevronDownIcon } from '@/icons';
import Select from '../form/Select';

type MaintenanceRecordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    initialData?: Partial<MaintenanceRecord>;
    onSubmit: (data: Partial<MaintenanceRecord>) => Promise<void>;
    onDelete?: (id: number) => void;
    resources: MaintenanceResource[];
};

export default function MaintenanceRecordModal({
    isOpen,
    onClose,
    mode,
    initialData,
    onSubmit,
    onDelete,
    resources,
}: MaintenanceRecordModalProps) {
    const [formData, setFormData] = useState<Partial<MaintenanceRecord> & {
        content_type?: number;
        object_id?: number;
        resource_repr?: string;
    }>(
        initialData || {}
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({});
        }
    }, [initialData]);

    const handleChange = <K extends keyof MaintenanceRecord>(field: K, value: MaintenanceRecord[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            setIsSubmitting(false);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };
    const handleDelete = () => {
        if (initialData?.id && onDelete) {
            onDelete(initialData.id);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] m-4">
            <div className="w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {mode === 'edit' ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    {mode === 'edit'
                        ? 'Update maintenance information.'
                        : 'Enter maintenance details to add a new record.'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="mb-5">
                        <Label>Title</Label>
                        <Input
                            type="text"
                            value={formData.title ?? ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        <div>
                            <Label>Description</Label>
                            <TextArea
                                value={formData.description}
                                onChange={value => handleChange('description', value)}
                                rows={6}
                            />
                        </div>
                        <div>
                            <Label>Target Resource</Label>
                            <div className="relative">
                                <Select
                                    options={resources.map(res => ({
                                        value: res.id.toString(),
                                        label: res.name,
                                    }))}
                                    value={formData.object_id?.toString() ?? ''}
                                    onChange={(val) => {
                                        const selected = resources.find(r => r.id.toString() === val);
                                        if (selected) {
                                            setFormData(prev => ({
                                                ...prev,
                                                object_id: selected.id,
                                                content_type: selected.content_type_id,
                                                resource_repr: selected.name,
                                            }));
                                        }
                                    }}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                            <div className="mt-5">
                                <DatePicker
                                    id="performed-at"
                                    label="Performed At"
                                    placeholder="Select a date"
                                    defaultDate={formData.performed_at ? new Date(formData.performed_at) : undefined}
                                    onChange={(dates) => {
                                        handleChange('performed_at', dates?.[0]);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        {mode === 'edit' && (
                            <Button
                                type="button"
                                variant="text-error"
                                onClick={handleDelete}
                            >
                                Delete Maintenance Record
                            </Button>
                        )}
                        <div className="flex gap-3  ml-auto">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting
                                    ? 'Saving...'
                                    : mode === 'edit'
                                        ? 'Save Changes'
                                        : 'Add Record'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
