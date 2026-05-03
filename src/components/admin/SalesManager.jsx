function SalesManager({ halls, selectedHallId, onSelectHall, selectedHall, onToggleSales }) {
    return (
        <>
            <p className="admin-section-text">Выберите зал для открытия/закрытия продаж:</p>
            <div className="admin-halls-grid">
                {halls.map(hall => (
                    <button
                        key={hall.id}
                        className={`admin-hall-select-btn ${selectedHallId === hall.id ? 'active' : ''}`}
                        onClick={() => onSelectHall(hall)}
                    >
                        {hall.hall_name}
                    </button>
                ))}
            </div>

            {selectedHall && (
                <div className="admin-sales-info">
                    <p className="admin-sales-message">
                        {selectedHall.hall_open === 1 ? 'Всё готово к закрытию' : 'Всё готово к открытию'}
                    </p>
                    <button className="admin-save-btn" onClick={onToggleSales}>
                        {selectedHall.hall_open === 1 ? 'Закрыть продажу билетов' : 'Открыть продажу билетов'}
                    </button>
                </div>
            )}
        </>
    );
}

export default SalesManager;