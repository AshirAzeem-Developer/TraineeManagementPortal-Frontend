"use client";
import React, { useEffect, useState, useCallback } from "react";
import traineeService, { Trainee } from "@/lib/api/trainee.service";
import ManageTraineeModal from "@/components/Trainees/ManageTraineeModal";
import DeleteTraineeModal from "@/components/Trainees/DeleteTraineeModal";
import ViewTraineeModal from "@/components/Trainees/ViewTraineeModal";
import Breadcrumb from "@/components/common/PageBreadCrumb";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User, 
  Chip, 
  Tooltip, 
  Button 
} from "@heroui/react";

const columns = [
  { name: "TRAINEE", uid: "name" },
  { name: "BATCH", uid: "batch" },
  { name: "STATUS", uid: "status" },
  { name: "JOINED", uid: "joined" },
  { name: "ACTIONS", uid: "actions" },
];

const TraineesPage = () => {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      const data = await traineeService.getAllTrainees();
      setTrainees(data);
    } catch (error) {
      console.error("Failed to fetch trainees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handleCreate = () => {
    setSelectedTrainee(null);
    setIsManageModalOpen(true);
  };

  const handleEdit = (trainee: Trainee) => {
    setSelectedTrainee(trainee);
    setIsManageModalOpen(true);
  };

  const handleView = (trainee: Trainee) => {
    setSelectedTrainee(trainee);
    setIsViewModalOpen(true);
  };

  const handleDelete = (trainee: Trainee) => {
    setSelectedTrainee(trainee);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (traineeData: Partial<Trainee> & { password?: string; batch_id?: number }) => {
    try {
      if (selectedTrainee) {
        await traineeService.updateTrainee(selectedTrainee.id, traineeData);
      } else {
        await traineeService.createTrainee(traineeData);
      }
      setIsManageModalOpen(false);
      fetchTrainees();
    } catch (error) {
      console.error("Failed to save trainee", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedTrainee) {
      try {
        await traineeService.deleteTrainee(selectedTrainee.id);
        setIsDeleteModalOpen(false);
        fetchTrainees();
      } catch (error) {
        console.error("Failed to delete trainee", error);
      }
    }
  };

  const renderCell = useCallback((trainee: Trainee, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: ""}}
            description={trainee.email}
            name={trainee.name}
          >
            {trainee.email}
          </User>
        );
      case "batch":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
                {trainee.trainee_profile?.batch?.name || "Unassigned"}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={trainee.is_active ? "success" : "default"}
            size="sm"
            variant="flat"
          >
            {trainee.is_active ? "Active" : "Inactive"}
          </Chip>
        );
      case "joined":
        return (
            <div className="flex flex-col">
                <p className="text-bold text-sm">
                    {new Date(trainee.created_at).toLocaleDateString()}
                </p>
            </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
             <Tooltip content="View Profile" className="dark:text-gray-200 bg-blue-600/85 rounded-md" >
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light"
                    className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onPress={() => handleView(trainee)}
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </Button>
              </span>
            </Tooltip>
            <Tooltip content="Edit Trainee" className="dark:text-gray-200 bg-green-600/85 rounded-md">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                 <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light"
                    className="text-[#24a556] hover:bg-[#24a556]/10"
                    onPress={() => handleEdit(trainee)}
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </Button>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Trainee" className="dark:text-gray-200 bg-red-600/85   rounded-md">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                 <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(trainee)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </Button>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <Breadcrumb pageTitle="Trainees" pageDescription="Manage trainees, their profiles, and batch assignments." />
           
        </div>
        <Button 
          size="lg"
          className="rounded-md font-medium shadow-lg shadow-[#24a556]/30 bg-[#24a556] hover:bg-[#1d8a47] text-white"
          startContent={
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
             </svg>
          }
          onPress={handleCreate}
        >
          Add Trainee
        </Button>
      </div>

      <div className="w-full">
        <Table aria-label="Trainees Table" selectionMode="none" className="dark:bg-gray-800 rounded-md">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn className="dark:text-gray-200" key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody 
            items={trainees} 
            loadingContent={<div>Loading...</div>}
            isLoading={loading}
            emptyContent={"No trainees found"}
          >
            {(item) => (
              <TableRow className=" dark:text-gray-200" key={item.id}>
                {(columnKey) => <TableCell className="dark:text-gray-200">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isManageModalOpen && (
        <ManageTraineeModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onSave={handleSave}
          trainee={selectedTrainee}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteTraineeModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          traineeName={selectedTrainee?.name}
        />
      )}

      {isViewModalOpen && (
        <ViewTraineeModal 
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            trainee={selectedTrainee}
        />
      )}
    </div>
  );
};

export default TraineesPage;
