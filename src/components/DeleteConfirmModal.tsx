import Modal from "./Modal";

const DeleteConfirmModal = ({
  title,
  message,
  onConfirm,
  onClose,
}: any) => {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-gray-400 mb-6">{message}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
