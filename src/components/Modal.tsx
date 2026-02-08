import { X } from "lucide-react";

const Modal = ({ title, children, onClose }: any) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {children}
      </div>
    </div>
  );
};

export default Modal;
