function InfoModal({message, onClose}) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal admin-modal-small">
                <div className="admin-modal-header">
                    <h3>ИНФОРМАЦИЯ</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <img src="./images/close.svg" alt="Закрыть"/>
                    </button>
                </div>
                <div className="admin-modal-body">
                    <p style={{textAlign: 'center', marginBottom: '20px'}}>{message}</p>
                    <div className="admin-modal-buttons">
                        <button className="admin-modal-add" onClick={onClose}>ОК</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoModal;