"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface DeleteBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  batchName?: string;
}

const DeleteBatchModal: React.FC<DeleteBatchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  batchName,
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onClose} 
      placement="center"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
      classNames={{
        closeButton: "top-4 right-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
      }}
    >
      <ModalContent className="bg-white dark:bg-boxdark rounded-2xl border border-red-200 dark:border-red-900/50 shadow-2xl">
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="w-6 h-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Batch
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </ModalHeader>
            <ModalBody className="px-6 py-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {batchName}
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    All associated data will be permanently removed from the system.
                  </p>
                </div>
                
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    This will permanently delete the batch and cannot be recovered.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-3">
              <Button 
                variant="light" 
                onPress={onClose}
                className="font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 px-6"
              >
                Cancel
              </Button>
              <Button 
                onPress={onConfirm}
                className="font-medium bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-lg shadow-red-600/30 px-6"
                startContent={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Delete Batch
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteBatchModal;