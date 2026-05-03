function AddSeanceModal({ seance, halls, films, onSeanceChange, onAdd, onClose }) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal admin-modal-seance">
                <div className="admin-modal-header">
                    <h3>ДОБАВЛЕНИЕ СЕАНСА</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <img src="/images/close.svg" alt="Закрыть"/>
                    </button>
                </div>
                <div className="admin-modal-body">
                    <label>Название зала</label>
                    <select
                        value={seance.hallId}
                        onChange={(e) => onSeanceChange('hallId', parseInt(e.target.value))}
                    >
                        <option value="" disabled>Название зала</option>
                        {halls.map(hall => (
                            <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                        ))}
                    </select>

                    <label>Название фильма</label>
                    <select
                        value={seance.filmId}
                        onChange={(e) => onSeanceChange('filmId', parseInt(e.target.value))}
                    >
                        <option value="" disabled>Название фильма</option>
                        {films.map(film => (
                            <option key={film.id} value={film.id}>{film.film_name}</option>
                        ))}
                    </select>

                    <label>Время начала</label>
                    <input
                        type="time"
                        value={seance.time}
                        onChange={(e) => onSeanceChange('time', e.target.value)}
                        step="300"
                    />

                    <div className="admin-modal-buttons">
                        <button className="admin-modal-add" onClick={onAdd}>ДОБАВИТЬ СЕАНС</button>
                        <button className="admin-modal-cancel" onClick={onClose}>ОТМЕНИТЬ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSeanceModal;