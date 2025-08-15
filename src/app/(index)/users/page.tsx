"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { createUser, getAllUsers, User } from "@/services/user";
import UsersTable from "@/components/tables/UsersTable";
import UserModal from "@/components/modals/UserModal";
import Alert from "@/components/ui/alert/Alert";

export default function Users() {

  const [alertProps, setAlertProps] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    showLink?: boolean;
    linkHref?: string;
    linkText?: string;
  } | null>(null);
  const token = useAuthStore((state) => state.user?.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchDCs = async () => {
      try {
        if (!token) return;
        const res = await getAllUsers(token);
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };
    fetchDCs();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreate = async (userData: Partial<User>) => {
    if (!token) return;

    try {
      const payload = { ...userData } as Omit<User, "id">;
      const res = await createUser(token, payload);
      setAlertProps({
        variant: "success",
        title: "Datacenter Created",
        message: `"${res.data.first_name} ${res.data.last_name}" has been successfully added.`,
      });
    } catch (err) {
      setAlertProps({
        variant: "error",
        title: "Creation Failed",
        message: `${err}`,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage Users" />
      {alertProps && (
        <div className="my-4">
          <Alert
            variant={alertProps.variant}
            title={alertProps.title}
            message={alertProps.message}
            showLink={alertProps.showLink}
            linkHref={alertProps.linkHref}
            linkText={alertProps.linkText}
            onClose={() => setAlertProps(null)}
          />
        </div>
      )}
      <div className="flex justify-end mb-6">
        <Button
          size="sm"
          variant="primary"
          startIcon={<PlusIcon />}
          onClick={handleOpenModal}
        >
          Add User
        </Button>
      </div>
      <div className="space-y-6">
        <UsersTable />
      </div>
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode="create"
        onSubmit={handleCreate}
      />
    </div>
  );
}
