'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Radio from '../form/input/Radio';
import Button from '../ui/button/Button';
import { Cluster, Datacenter, Network, Server } from '@/services/asset';
import { assetStatusLabels } from '@/services/asset';
import { ChevronDownIcon } from '@/icons';

type ServerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  datacenters: Datacenter[];
  clusters: Cluster[];
  networks: Network[];
  initialData?: Partial<Server>;
  onSubmit: (data: Partial<Server>) => Promise<void>;
  onDelete?: (id: number) => void;
};

export default function ServerModal({
  isOpen,
  onClose,
  mode,
  datacenters,
  clusters,
  networks,
  initialData,
  onSubmit,
  onDelete,
}: ServerModalProps) {
  const [formData, setFormData] = useState<Partial<Server>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDatacenterId = formData.datacenter;

  const filteredClusters = clusters.filter(
    cluster => cluster.datacenter === selectedDatacenterId
  );

  const filteredNetworks = networks.filter(
    network => network.datacenter == selectedDatacenterId
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData]);

  const handleChange = <K extends keyof Server>(field: K, value: Server[K]) => {
    setFormData(prev => {
      let updated = { ...prev, [field]: value };

      // If status changed and it's not 'in_use', clear IP address
      if (field === 'status' && value !== 'in_use') {
        updated.ip_address = '';
      }

      if (field === 'datacenter') {
        updated.cluster = undefined;
        updated.network = undefined;
      }

      return updated;
    });
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

  const isIPDisabled = formData.status !== 'in_use';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] m-4">
      <div className="w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {mode === 'edit' ? 'Edit Server' : 'Add Server'}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {mode === 'edit'
            ? 'Update server information.'
            : 'Enter server details to add a new server.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Label>Serial Number</Label>
              <Input
                type="text"
                value={formData.serial_number ?? ''}
                onChange={e => handleChange('serial_number', e.target.value)}
              />
            </div>

            <div>
              <Label>Model</Label>
              <Input
                type="text"
                value={formData.model ?? ''}
                onChange={e => handleChange('model', e.target.value)}
              />
            </div>

            <div>
              <Label>Manufacturer</Label>
              <Input
                type="text"
                value={formData.manufacturer ?? ''}
                onChange={e => handleChange('manufacturer', e.target.value)}
              />
            </div>

            <div>
              <Label>Datacenter</Label>
              <div className="relative">
                <Select
                  options={datacenters.map(dc => ({
                    value: dc.id,
                    label: dc.name,
                  }))}
                  value={formData.datacenter}
                  onChange={val =>
                    handleChange('datacenter', Number(val) as any)
                  }
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
                  options={filteredClusters.map(cluster => ({
                    value: cluster.id,
                    label: cluster.name,
                  }))}
                  value={formData.cluster ?? ''}
                  onChange={val => handleChange('cluster', Number(val) as any)}
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
                  options={filteredNetworks.map(net => ({
                    value: net.id,
                    label: `${net.name} (${net.cidr})`,
                  }))}
                  value={formData.network ?? ''}
                  onChange={val => handleChange('network', Number(val) as any)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Status + IP row */}
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <Label>Status</Label>
                <div className="flex gap-3 mt-5 flex-wrap">
                  {Object.entries(assetStatusLabels).map(([value, label]) => (
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

              <div>
                <Label>IP Address</Label>
                <Input
                  type="text"
                  value={formData.ip_address ?? ''}
                  onChange={e => handleChange('ip_address', e.target.value)}
                  disabled={isIPDisabled}
                />
              </div>
            </div>

            {/* Last row: CPU, RAM, Storage */}
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <Label>CPU</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.cpu ?? ''}
                    onChange={e =>
                      handleChange('cpu', Number(e.target.value))
                    }
                    className="pr-[78px]"
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    cores
                  </span>
                </div>
              </div>
              <div>
                <Label>RAM</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.ram ?? ''}
                    onChange={e =>
                      handleChange('ram', Number(e.target.value))
                    }
                    className="pr-[62px]"
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    GB
                  </span>
                </div>
              </div>
              <div>
                <Label>Storage</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.storage ?? ''}
                    onChange={e =>
                      handleChange('storage', Number(e.target.value))
                    }
                    className="pr-[62px]"
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    GB
                  </span>
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
                Delete Server
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
                    : 'Add Server'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
