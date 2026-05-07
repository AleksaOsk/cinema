function DeleteConfirmModal({onConfirm, onClose, itemName = 'сеанс'}) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal admin-modal-small">
                <div className="admin-modal-header">
                    <h3>ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <img src="./images/close.svg" alt="Закрыть"/>
                    </button>
                </div>
                <div className="admin-modal-body">
                    <p style={{textAlign: 'center', marginBottom: '20px'}}>
                        Вы уверены, что хотите удалить {itemName}?
                    </p>
                    <div className="admin-modal-buttons">
                        <button className="admin-modal-cancel" onClick={onClose}>ОТМЕНА</button>
                        <button className="admin-modal-add" onClick={onConfirm}>УДАЛИТЬ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;