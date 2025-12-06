"use client";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Spinner
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Batch } from "@/lib/api/batch.service";
import InputGroup from "@/components/form/InputGroup";

interface ManageBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batch: Partial<Batch>) => Promise<void>;
  batch?: Batch | null;
}

const ManageBatchModal: React.FC<ManageBatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batch,
}) => {
  const [formData, setFormData] = useState<Partial<Batch>>({
    name: "",
    duration_months: 6,
    start_date: "",
    description: "",
    is_active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name,
        duration_months: batch.duration_months,
        start_date: batch.start_date.split("T")[0],
        description: batch.description,
        is_active: batch.is_active,
      });
    } else {
      setFormData({
        name: "",
        duration_months: 6,
        start_date: "",
        description: "",
        is_active: true,
      });
    }
    setErrors({});
  }, [batch, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({ ...prev, [name]: checked }));
        return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = "Batch name is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.duration_months || formData.duration_months < 1) newErrors.duration_months = "Duration must be at least 1 month";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsLoading(true);
        await onSave(formData);
      } catch (error) {
        console.error("Error saving batch", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onClose} 
      placement="center" 
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
      classNames={{
        closeButton: "top-4 right-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
      }}
      isDismissable={!isLoading}
    >
      <ModalContent className="bg-white dark:bg-boxdark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              {batch ? "Edit Batch" : "Create New Batch"}
            </ModalHeader>
            <ModalBody className="px-6 py-5">
              <form id="manage-batch-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <InputGroup
                    label="Batch Name"
                    type="text"
                    name="name"
                    placeholder="e.g. Batch 1 - Fall 2025"
                    value={formData.name as string}
                    onChange={handleChange}
                    customClasses="mb-0 focus:border-[#24a556] focus:ring-[#24a556]/20"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputGroup
                      label="Duration (Months)"
                      type="number"
                      name="duration_months"
                      placeholder="6"
                      value={formData.duration_months as number}
                      onChange={handleChange}
                      customClasses="mb-0 focus:border-[#24a556] focus:ring-[#24a556]/20"
                      required
                    />
                    {errors.duration_months && (
                      <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.duration_months}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputGroup
                      label="Start Date"
                      type="date"
                      name="start_date"
                      placeholder=""
                      value={formData.start_date as string}
                      onChange={handleChange}
                      customClasses="mb-0 focus:border-[#24a556] focus:ring-[#24a556]/20"
                      required
                    />
                    {errors.start_date && (
                      <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.start_date}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Enter description..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 font-medium outline-none transition focus:border-[#24a556] focus:ring-4 focus:ring-[#24a556]/20 disabled:cursor-default disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    value={formData.description || ""}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#24a556]/5 dark:bg-[#24a556]/10 border border-[#24a556]/20">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    name="is_active"
                    checked={formData.is_active || false}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-[#24a556] focus:ring-[#24a556] focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    Active Batch
                  </label>
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 gap-3">
              <Button 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
                className="font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="manage-batch-form"
                isDisabled={isLoading}
                className="font-medium bg-[#24a556] hover:bg-[#1d8a47] text-white shadow-lg shadow-[#24a556]/30 px-6"
                startContent={isLoading ? <Spinner size="sm" color="current" className="animate-spin" /> : null}
              >
                {isLoading ? (batch ? "Updating..." : "Creating...") : (batch ? "Update" : "Create")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ManageBatchModal;