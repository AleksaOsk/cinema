function AddHallModal({ hallName, onHallNameChange, onClose, onAdd }) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <h3>ДОБАВЛЕНИЕ ЗАЛА</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <img src="images/close.svg" alt="Закрыть"/>
                    </button>
                </div>
                <div className="admin-modal-body">
                    <label>Название зала</label>
                    <input
                        type="text"
                        placeholder="Например, «Зал 1»"
                        value={hallName}
                        onChange={(e) => onHallNameChange(e.target.value)}
                    />
                    <div className="admin-modal-buttons">
                        <button className="admin-modal-add" onClick={onAdd}>ДОБАВИТЬ ФИЛЬМ</button>
                        <button className="admin-modal-cancel" onClick={onClose}>ОТМЕНИТЬ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddHallModal;