function PriceManager({halls, selectedHallId, onSelectHall, prices, onPriceChange, onSave, onCancel}) {
    const handlePriceInput = (type, value) => {
        let numValue = Number(value);
        if (isNaN(numValue)) numValue = 1;
        if (numValue <= 0) numValue = 1;
        onPriceChange(type, numValue);
    };

    return (
        <>
            <p className="admin-section-text">Выберите зал для конфигурации:</p>
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

            {selectedHallId && (
                <>
                    <p className="admin-section-text" style={{marginTop: '20px'}}>Установите цены для типов кресел:</p>

                    <div className="admin-price-row">
                        <div className="admin-price-field">
                            <label>Цена, рублей</label>
                            <input
                                type="number"
                                value={prices.standart}
                                onChange={(e) => handlePriceInput('standart', e.target.value)}
                                min="1"
                                placeholder="0"
                            />
                        </div>
                        <span className="admin-price-label">за</span>
                        <div className="admin-legend-seat standart"></div>
                        <span className="admin-price-desc">обычные кресла</span>
                    </div>

                    <div className="admin-price-row">
                        <div className="admin-price-field">
                            <label>Цена, рублей</label>
                            <input
                                type="number"
                                value={prices.vip}
                                onChange={(e) => handlePriceInput('vip', e.target.value)}
                                min="1"
                                placeholder="0"
                            />
                        </div>
                        <span className="admin-price-label">за</span>
                        <div className="admin-legend-seat vip"></div>
                        <span className="admin-price-desc">VIP кресла</span>
                    </div>

                    <div className="admin-config-buttons">
                        <button className="admin-cancel-btn" onClick={onCancel}>ОТМЕНА</button>
                        <button className="admin-save-btn" onClick={onSave}>СОХРАНИТЬ</button>
                    </div>
                </>
            )}
        </>
    );
}

export default PriceManager;