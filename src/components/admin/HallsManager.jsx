function HallsManager({ halls, onDeleteHall, onCreateHall }) {
    return (
        <>
            <p className="admin-section-text">Доступные залы:</p>
            <div className="admin-halls-list">
                {halls.map(hall => (
                    <div key={hall.id} className="admin-hall-item">
                        <span className="admin-hall-name">– {hall.hall_name}</span>
                        <button
                            className="admin-delete-btn"
                            onClick={() => onDeleteHall(hall.id)}
                        >
                            <img src="/public/images/trash.svg" alt="Удалить"/>
                        </button>
                    </div>
                ))}
            </div>
            <div className="admin-btn">
                <button className="admin-create-btn" onClick={onCreateHall}>
                    СОЗДАТЬ ЗАЛ
                </button>
            </div>
        </>
    );
}

export default HallsManager;