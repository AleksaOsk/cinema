import {useScaledSeats} from "../../hooks/useScaledSeats.js";

function HallConfigurator({
                              halls,
                              selectedHallId,
                              onSelectHall,
                              selectedHall,
                              rows,
                              onRowsChange,
                              places,
                              onPlacesChange,
                              hallConfig,
                              onUpdateSeat,
                              onSave,
                              onCancel
                          }) {
    const {containerRef, seatSize} = useScaledSeats([hallConfig, rows, places, selectedHall]);

    const getGap = () => {
        if (places > 30) return 2;
        if (places > 20) return 4;
        return 8;
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

            {selectedHall && (
                <>
                    <p className="admin-section-text">Укажите количество рядов и максимальное количество кресел в
                        ряду:</p>
                    <div className="admin-config-row">
                        <div className="admin-config-field">
                            <label>Рядов, шт</label>
                            <input
                                type="number"
                                value={rows}
                                onChange={(e) => onRowsChange(parseInt(e.target.value) || 1)}
                                min="1"
                                max="100"
                            />
                        </div>
                        <span className="admin-config-x">x</span>
                        <div className="admin-config-field">
                            <label>Мест, шт</label>
                            <input
                                type="number"
                                value={places}
                                onChange={(e) => onPlacesChange(parseInt(e.target.value) || 1)}
                                min="1"
                                max="100"
                            />
                        </div>
                    </div>

                    <p className="admin-section-text">Теперь вы можете указать типы кресел на схеме зала:</p>
                    <div className="admin-legend">
                        <div className="admin-legend-item">
                            <div className="admin-legend-seat standart"></div>
                            <span>— обычные кресла</span>
                        </div>
                        <div className="admin-legend-item">
                            <div className="admin-legend-seat vip"></div>
                            <span>— VIP кресла</span>
                        </div>
                        <div className="admin-legend-item">
                            <div className="admin-legend-seat disabled"></div>
                            <span>— заблокированные (нет кресла)</span>
                        </div>
                    </div>
                    <p className="admin-section-hint">
                        {window.innerWidth <= 480
                            ? 'Чтобы изменить вид кресла, нажмите по нему'
                            : 'Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши'}
                    </p>

                    <div className="admin-hall-scheme" ref={containerRef}>
                        <div className="admin-screen">
                            <span>ЭКРАН</span>
                        </div>
                        <div className="admin-seats-grid">
                            {hallConfig.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="admin-seats-row"
                                    style={{
                                        gap: `${getGap()}px`,
                                        justifyContent: 'center',
                                    }}
                                >
                                    {row.map((seat, placeIndex) => (
                                        <button
                                            key={placeIndex}
                                            className={`admin-seat ${seat}`}
                                            style={{
                                                width: `${seatSize}px`,
                                                height: `${seatSize}px`,
                                                flexShrink: 0,
                                            }}
                                            onClick={() => onUpdateSeat(rowIndex, placeIndex)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
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

export default HallConfigurator;