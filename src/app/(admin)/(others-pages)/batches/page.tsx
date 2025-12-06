"use client";
import React, { useEffect, useState } from "react";
import batchService, { Batch } from "@/lib/api/batch.service";
import ManageBatchModal from "@/components/Batches/ManageBatchModal";
import DeleteBatchModal from "@/components/Batches/DeleteBatchModal";
import Breadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, CardBody, CardFooter, Chip, Button, Tooltip, User } from "@heroui/react";

const BatchesPage = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await batchService.getAllBatches();
      setBatches(data);
    } catch (error) {
      console.error("Failed to fetch batches", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreate = () => {
    setSelectedBatch(null);
    setIsManageModalOpen(true);
  };

  const handleEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsManageModalOpen(true);
  };

  const handleDelete = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (batchData: Partial<Batch>) => {
    try {
      if (selectedBatch) {
        await batchService.updateBatch(selectedBatch.id, batchData);
      } else {
        await batchService.createBatch(batchData);
      }
      setIsManageModalOpen(false);
      fetchBatches();
    } catch (error) {
      console.error("Failed to save batch", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBatch) {
      try {
        await batchService.deleteBatch(selectedBatch.id);
        setIsDeleteModalOpen(false);
        fetchBatches();
      } catch (error) {
        console.error("Failed to delete batch", error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <Breadcrumb  pageTitle="Batches" pageDescription=" Manage your training batches, schedules, and status."  />
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
          Create Batch
        </Button>
      </div>

      {/* Content Grid */}
      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
            ))}
         </div>
      ) : batches.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-[#24a556]/30 dark:border-[#24a556]/50">
             <div className="mx-auto h-12 w-12 text-[#24a556]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No batches</h3>
             <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Get started by creating a new batch.</p>
             <div className="mt-6">
                <Button 
                  onPress={handleCreate}
                  className="bg-[#24a556] hover:bg-[#1d8a47] text-white"
                >
                  New Batch
                </Button>
             </div>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card 
                key={batch.id} 
                className="rounded-lg hover:scale-[1.02] transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-[#24a556]/10 hover:border-[#24a556]/30 dark:hover:border-[#24a556]/50 dark:bg-boxdark"
                radius="lg"
            >
              <CardHeader className="flex justify-between items-start px-6 pt-6 pb-2">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{batch.name}</h3>
                    <p className="text-xs text-[#24a556] flex items-center gap-1 mt-1 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {batch.duration_months} Months
                    </p>
                 </div>
                 <Chip
                    className="capitalize font-medium shadow-sm px-1"
                    color={batch.is_active ? "success" : "default"}
                    variant="flat"
                    size="sm"
                    style={batch.is_active ? { backgroundColor: 'rgba(36, 165, 86, 0.15)', color: '#24a556' } : {}}
                    startContent={batch.is_active ? <span className="mr-1 w-1.5 h-1.5 rounded-full bg-[#24a556] ml-1 animate-pulse"></span> : undefined}
                 >
                    {batch.is_active ? "Active" : "Inactive"}
                 </Chip>
              </CardHeader>
              <CardBody className="px-6 py-2">
                 <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[2.5rem]">
                    {batch.description || "No description provided."}
                 </p>
                 
                 <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-200 bg-[#24a556]/5 dark:bg-[#24a556]/10 p-2 rounded-lg border border-[#24a556]/20 dark:border-[#24a556]/30">
                       <span className="text-[#24a556] mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       </span>
                       <span className="font-semibold mr-1">Start:</span> {batch.start_date?.split('T')[0]}
                    </div>
                    {batch.end_date && (
                         <div className="flex items-center text-sm text-gray-700 dark:text-gray-200 bg-[#24a556]/5 dark:bg-[#24a556]/10 p-2 rounded-lg border border-[#24a556]/20 dark:border-[#24a556]/30">
                            <span className="text-[#24a556] mr-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </span>
                             <span className="font-semibold mr-1">End:</span> {batch.end_date.split('T')[0]}
                        </div>
                    )}
                 </div>
              </CardBody>
              <CardFooter className="px-6 pb-6 pt-2 flex justify-end gap-2">
                 <Tooltip content="Edit Batch">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm" 
                        onPress={() => handleEdit(batch)}
                        className="text-[#24a556] hover:bg-[#24a556]/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </Button>
                 </Tooltip>
                 <Tooltip content="Delete Batch" color="danger">
                     <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm" 
                        color="danger"
                        onPress={() => handleDelete(batch)}
                         className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </Button>
                 </Tooltip>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isManageModalOpen && (
        <ManageBatchModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onSave={handleSave}
          batch={selectedBatch}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteBatchModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          batchName={selectedBatch?.name}
        />
      )}
    </div>
  );
};

export default BatchesPage;