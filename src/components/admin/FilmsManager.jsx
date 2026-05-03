function FilmsManager({ films, onDragStart, onDeleteFilm, onAddFilm }) {
    return (
        <>
            <button className="admin-create-btn" onClick={onAddFilm}>
                ДОБАВИТЬ ФИЛЬМ
            </button>

            <div className="admin-films-grid">
                {films.map((film, index) => (
                    <div
                        key={film.id}
                        className="admin-film-card"
                        draggable
                        onDragStart={() => onDragStart(film)}
                        style={{
                            backgroundColor: `hsl(${index * 40 % 360}, 60%, 85%)`,
                            borderColor: `hsl(${index * 40 % 360}, 60%, 35%)`
                        }}
                    >
                        <img src={film.film_poster} alt={film.film_name} className="admin-film-poster"/>
                        <div className="admin-film-info">
                            <div className="admin-film-name">{film.film_name}</div>
                            <div className="admin-film-duration">{film.film_duration} мин</div>
                        </div>
                        <button className="admin-film-delete" onClick={() => onDeleteFilm(film.id)}>
                            <img src="/images/trash.svg" alt="Удалить"/>
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FilmsManager;