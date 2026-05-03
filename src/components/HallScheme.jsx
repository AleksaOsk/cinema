function HallScheme({hallConfig, selectedSeats, onSeatSelect}) {
    if (!hallConfig || hallConfig.length === 0) {
        return <div className="hall-scheme-loading">Загрузка схемы зала...</div>;
    }

    return (
        <div className="hall-scheme">
            <div className="hall-screen">
                <div className="screen-curved"></div>
                <div className="screen-label">ЭКРАН</div>
            </div>

            <div className="hall-rows">
                {hallConfig.map((row, rowIndex) => (
                    <div key={rowIndex} className="hall-row">
                        <div className="row-seats">
                            {row.map((seatType, placeIndex) => {
                                const seatKey = `${rowIndex + 1}_${placeIndex + 1}`;
                                const isSelected = selectedSeats.includes(seatKey);
                                const isTaken = seatType === 'taken';
                                const isVip = seatType === 'vip';
                                const isDisabled = seatType === 'disabled';

                                if (isDisabled) {
                                    return <div key={placeIndex} className="seat disabled"/>;
                                }

                                let seatClass = 'seat';
                                if (isTaken) seatClass += ' taken';
                                else if (isSelected) seatClass += ' selected';
                                else if (isVip) seatClass += ' vip';
                                else seatClass += ' free';

                                return (
                                    <button
                                        key={placeIndex}
                                        className={seatClass}
                                        onClick={() => onSeatSelect(rowIndex + 1, placeIndex + 1, seatType, isTaken)}
                                        disabled={isTaken}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HallScheme;