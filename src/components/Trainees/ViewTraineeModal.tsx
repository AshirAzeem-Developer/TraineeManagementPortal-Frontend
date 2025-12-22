"use client";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Avatar,
  Chip,
  Divider
} from "@heroui/react";
import { Trainee } from "@/lib/api/trainee.service";

interface ViewTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: Trainee | null;
}

const ViewTraineeModal: React.FC<ViewTraineeModalProps> = ({
  isOpen,
  onClose,
  trainee,
}) => {
  if (!trainee) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onClose} 
      placement="center" 
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
      classNames={{
        closeButton: "top-4 right-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
      }}
      size="md"
    >
      <ModalContent className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 px-6 py-4">
              Trainee Profile
            </ModalHeader>
            <ModalBody className="px-6 py-6">
              <div className="flex flex-col items-center mb-6">
                 <Avatar 
                    name={trainee.name} 
                    className="w-24 h-24 text-3xl font-bold bg-[#24a556]/10 text-[#24a556] mb-4 shadow-lg shadow-[#24a556]/20"
                 />
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{trainee.name}</h2>
                 <p className="text-gray-500 dark:text-gray-400">{trainee.email}</p>
                 <Chip
                    className="mt-3 capitalize font-medium shadow-sm px-2"
                    color={trainee.is_active ? "success" : "default"}
                    variant="flat"
                    size="sm"
                    style={trainee.is_active ? { backgroundColor: 'rgba(36, 165, 86, 0.15)', color: '#24a556' } : {}}
                    startContent={trainee.is_active ? <span className="mr-1 w-1.5 h-1.5 rounded-full bg-[#24a556] ml-1 animate-pulse"></span> : undefined}
                 >
                    {trainee.is_active ? "Active Account" : "Inactive Account"}
                 </Chip>
              </div>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Academic Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-3 last:mb-0">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Current Batch</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {trainee.trainee_profile?.batch?.name || "Not Assigned"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {trainee.role}
                            </span>
                        </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        System Information
                    </h3>
                     <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Member Since</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(trainee.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(trainee.updated_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                 </div>
              </div>

            </ModalBody>
            <ModalFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <Button 
                onPress={onClose}
                className="w-full font-medium bg-[#24a556] hover:bg-[#1d8a47] text-white shadow-lg shadow-[#24a556]/30"
              >
                Close Profile
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewTraineeModal;
