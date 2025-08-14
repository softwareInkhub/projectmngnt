import React, { useState } from "react";
import CreateDepartmentModal from "./CreateDepartmentModal";

export default function CreateDepartmentPage({ onClose }: { onClose?: () => void }) {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    onClose?.();
  };

  const handleCreate = (department: {
    name: string;
    description: string;
    company: string;
    location: string;
    manager: string;
    budget: string;
    startDate: string;
    teamMembers: string[];
  }) => {
    console.log("Creating department:", department);
    // Here you would typically save the department to your state or API
    handleClose();
  };

  return (
    <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
      <CreateDepartmentModal
        open={showModal}
        onClose={handleClose}
        onSubmit={handleCreate}
      />
    </div>
  );
} 