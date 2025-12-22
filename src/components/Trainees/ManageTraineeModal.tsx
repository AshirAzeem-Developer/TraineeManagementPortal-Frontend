"use client";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Spinner,
  Select,
  SelectItem
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Trainee } from "@/lib/api/trainee.service";
import InputGroup from "@/components/form/InputGroup";
import batchService, { Batch } from "@/lib/api/batch.service";

interface ManageTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainee: Partial<Trainee> & { password?: string; batch_id?: number }) => Promise<void>;
  trainee?: Trainee | null;
}

const ManageTraineeModal: React.FC<ManageTraineeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  trainee,
}) => {
  const [formData, setFormData] = useState<Partial<Trainee> & { password?: string; batch_id?: number }>({
    name: "",
    email: "",
    password: "",
    is_active: true,
    batch_id: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Fetch batches for the dropdown
    const fetchBatches = async () => {
      try {
        const data = await batchService.getAllBatches();
        setBatches(data);
      } catch (error) {
        console.error("Failed to fetch batches", error);
      }
    };
    if (isOpen) {
        fetchBatches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (trainee) {
      setFormData({
        name: trainee.name,
        email: trainee.email,
        is_active: trainee.is_active,
        batch_id: trainee.trainee_profile?.batch?.id,
        // password is left empty for editing, only send if changing
        password: "" 
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        is_active: true,
        batch_id: undefined
      });
    }
    setErrors({});
  }, [trainee, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setFormData(prev => ({ ...prev, batch_id: val ? Number(val) : undefined }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!trainee && !formData.password?.trim()) newErrors.password = "Password is required for new trainees";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsLoading(true);
        // Sanitize data
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        if (!payload.batch_id) delete payload.batch_id; // If not selected, don't send or send null if backend requires clearing? 
        // Assuming backend handles undefined as "no change" or "no value". 
        // If we want to UNASSIGN a batch, we might need to send null. 
        // For now, let's assume we just want to send valid IDs.

        await onSave(payload);
      } catch (error) {
        console.error("Error saving trainee", error);
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
      <ModalContent className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 px-6 py-4">
              {trainee ? "Edit Trainee" : "Add New Trainee"}
            </ModalHeader>
            <ModalBody className="px-6 py-5">
              <form id="manage-trainee-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <InputGroup
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name as string}
                    onChange={handleChange}
                    customClasses="mb-0 focus:border-[#24a556] focus:ring-[#24a556]/20"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                   <InputGroup
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="e.g. john@example.com"
                    value={formData.email as string}
                    onChange={handleChange}
                    customClasses="mb-0 focus:border-[#24a556] focus:ring-[#24a556]/20"
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                
                 <div>
                   <InputGroup
                    label={trainee ? "Password (leave blank to keep current)" : "Password"}
                    type="password"
                    name="password"
                    placeholder={trainee ? "********" : "Enter password"}
                    value={formData.password as string}
                    onChange={handleChange}
                    customClasses="mb-0 focus:border-[#24a556] focus:ring-[#24a556]/20"
                    required={!trainee}
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                        Batch
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-gray-900">
                        <select
                            name="batch_id"
                            value={formData.batch_id || ""}
                            onChange={handleBatchChange}
                            className="relative z-20 w-full appearance-none rounded border border-gray-300 dark:border-gray-700 bg-transparent py-3 px-5 outline-none transition focus:border-[#24a556] active:border-[#24a556] dark:bg-gray-900 dark:focus:border-[#24a556] text-black dark:text-white"
                        >
                            <option value="" className="text-gray-500 dark:text-gray-400">Select Batch</option>
                            {batches.map((b) => (
                                <option key={b.id} value={b.id} className="dark:bg-gray-900">
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                            <svg className="fill-current text-gray-500 dark:text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" />
                            </svg>
                        </span>
                    </div>
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
                    Active Account
                  </label>
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 gap-3">
              <Button 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
                className="font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="manage-trainee-form"
                isDisabled={isLoading}
                className="font-medium bg-[#24a556] hover:bg-[#1d8a47] text-white shadow-lg shadow-[#24a556]/30 px-6"
                startContent={isLoading ? <Spinner size="sm" color="current" className="animate-spin" /> : null}
              >
                {isLoading ? (trainee ? "Updating..." : "Creating...") : (trainee ? "Update" : "Create")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ManageTraineeModal;
