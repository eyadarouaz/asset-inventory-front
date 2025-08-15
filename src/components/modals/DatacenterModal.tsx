'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { Datacenter } from '@/services/asset';

type DatacenterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    initialData?: Partial<Datacenter>;
    onSubmit: (data: Partial<Datacenter>) => Promise<void>;
    onDelete?: (id: number) => void;
};

export default function DatacenterModal({
    isOpen,
    onClose,
    mode,
    initialData,
    onSubmit,
    onDelete,
}: DatacenterModalProps) {
    const [formData, setFormData] = useState<Partial<Datacenter>>(initialData || {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({});
        }
    }, [initialData]);

    const handleChange = <K extends keyof Datacenter>(field: K, value: Datacenter[K]) => {
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
                    {mode === 'edit' ? 'Edit Datacenter' : 'Add Datacenter'}
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    {mode === 'edit'
                        ? 'Update datacenter information.'
                        : 'Enter datacenter details to add a new datacenter.'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        <div>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                value={formData.name ?? ''}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                value={formData.location ?? ''}
                                onChange={e => handleChange('location', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        {mode === 'edit' && (
                            <Button
                                type="button"
                                variant="text-error"
                                onClick={handleDelete}
                            >
                                Delete Datacenter
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
                                        : 'Add Datacenter'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
