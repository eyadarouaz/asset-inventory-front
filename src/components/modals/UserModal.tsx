'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Radio from '../form/input/Radio';
import Button from '../ui/button/Button';
import { assetStatusLabels } from '@/services/asset';
import { ChevronDownIcon, EnvelopeIcon } from '@/icons';
import { User, userStatusLabels } from '@/services/user';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => Promise<void>;
  onDelete?: (id: number) => void;
};

export default function UserModal({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
  onDelete,
}: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData]);

  const handleChange = <K extends keyof User>(field: K, value: User[K]) => {
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
          {mode === 'edit' ? 'Edit User' : 'Add User'}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {mode === 'edit'
            ? 'Update user information.'
            : 'Enter user details to add a new user.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                value={formData.first_name ?? ''}
                onChange={e => handleChange('first_name', e.target.value)}
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={formData.last_name ?? ''}
                onChange={e => handleChange('last_name', e.target.value)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.email ?? ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="pl-[62px]"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <EnvelopeIcon />
                </span>
              </div>
            </div>

            <div>
              <Label>Role</Label>
              <div className="relative">
                <Select
                  options={[
                    { value: 'operator', label: 'Operator' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                  value={formData.role}
                  onChange={val => handleChange('role', val as 'operator' | 'admin')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <Label>Status</Label>
                <div className="flex gap-3 mt-5 flex-wrap">
                  {Object.entries(userStatusLabels).map(([value, label]) => (
                    <Radio
                      key={value}
                      id={`status-${value}`}
                      name="status"
                      value={value}
                      checked={formData.status === value}
                      onChange={() => handleChange('status', value)}
                      label={label}
                    />
                  ))}
                </div>
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
                Delete User
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
                    : 'Add User'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
