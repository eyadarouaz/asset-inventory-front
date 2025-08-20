'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DeploymentJobForm } from '@/components/form/DeploymentJobForm';

import { Cluster, Datacenter, getAllClusters, getAllDatacenters, getAllNetworks, Network } from '@/services/asset';
import { useAuthStore } from '@/stores/useAuthStore';

export default function DeployPage() {
    const token = useAuthStore((state) => state.user?.token);
    const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!token) return;
            try {
                const [dcRes, clRes, netRes] = await Promise.all([
                    getAllDatacenters(token),
                    getAllClusters(token),
                    getAllNetworks(token),
                ]);
                setDatacenters(dcRes.data);
                setClusters(clRes.data);
                setNetworks(netRes.data);
            } catch (err) {
                console.error('Failed to load assets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, []);

    if (loading) return <div className="p-6">Loading deployment form...</div>;

    return (
        <div>
            <PageBreadcrumb pageTitle="Create Deployment Job" />
            <div className="space-y-6">
                <DeploymentJobForm
                    datacenters={datacenters}
                    clusters={clusters}
                    networks={networks}
                />
            </div>
        </div>
    );
}
