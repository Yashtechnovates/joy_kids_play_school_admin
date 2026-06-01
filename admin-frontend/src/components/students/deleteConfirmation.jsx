import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, studentName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="p-6">
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <span className="font-semibold">{studentName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={onConfirm}>Yes, Delete</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;