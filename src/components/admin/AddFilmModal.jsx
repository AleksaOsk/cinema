function AddFilmModal({
                          film,
                          onFilmChange,
                          posterFile,
                          onPosterSelect,
                          onPosterDelete,
                          onAdd,
                          onClose
                      }) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal admin-modal-film">
                <div className="admin-modal-header">
                    <h3>ДОБАВЛЕНИЕ ФИЛЬМА</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <img src="/images/close.svg" alt="Закрыть"/>
                    </button>
                </div>
                <div className="admin-modal-body">
                    <label>Название фильма</label>
                    <input
                        type="text"
                        placeholder="Например, «Гражданин Кейн»"
                        value={film.name}
                        onChange={(e) => onFilmChange('name', e.target.value)}
                    />

                    <label>Продолжительность фильма (мин.)</label>
                    <input
                        type="number"
                        value={film.duration}
                        onChange={(e) => onFilmChange('duration', e.target.value)}
                    />

                    <label>Описание фильма</label>
                    <textarea
                        rows="3"
                        value={film.description}
                        onChange={(e) => onFilmChange('description', e.target.value)}
                    />

                    <label>Страна</label>
                    <input
                        type="text"
                        value={film.origin}
                        onChange={(e) => onFilmChange('origin', e.target.value)}
                    />

                    <input
                        id="posterUpload"
                        type="file"
                        accept="image/png"
                        style={{display: 'none'}}
                        onChange={onPosterSelect}
                    />

                    {posterFile && (
                        <div className="admin-poster-info">
                            <label>Постер</label>
                            <div className="admin-poster-info-trash">
                                <span className="admin-poster-name">{posterFile.name}</span>
                                <button className="admin-poster-delete" onClick={onPosterDelete}>
                                    <img src="/images/trash.svg" alt="Удалить"/>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="admin-modal-buttons">
                        <button className="admin-modal-add" onClick={onAdd}>ДОБАВИТЬ ФИЛЬМ</button>
                        <button
                            className="admin-modal-add"
                            onClick={() => document.getElementById('posterUpload').click()}
                        >
                            ЗАГРУЗИТЬ ПОСТЕР
                        </button>
                        <button className="admin-modal-cancel" onClick={onClose}>ОТМЕНИТЬ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFilmModal;