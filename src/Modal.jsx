const Modal = ({ isOpen, onClose, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <p>換人定換位?</p>
                <button onClick={() => { onConfirm('replace'); onClose(); }}>換人</button>
                <button onClick={() => { onConfirm('swap'); onClose(); }}>換位</button>
                <button onClick={onClose}>撳錯</button>
            </div>
        </div>
    );
};

export default Modal;