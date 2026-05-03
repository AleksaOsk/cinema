import HallSessions from './HallSessions';

function MovieCard({film, sessionsByHall, currentDate}) {
    const description = film.film_description || 'Описание временно недоступно';
    const origin = film.film_origin || 'Страна не указана';

    return (
        <div className="movie-card">
            <div className="movie-poster-section">
                <div className="movie-decor"></div>
                <img
                    className="movie-poster"
                    src={film.film_poster}
                    alt={film.film_name}
                    onError={e => e.target.src = '/placeholder.svg'}
                />
            </div>
            <div className="movie-info-section">
                <div className="movie-title">{film.film_name}</div>
                <div className="movie-description">{description}</div>
                <div className="movie-details">{film.film_duration} мин, {origin}</div>
            </div>
            <div className="movie-sessions-section">
                {sessionsByHall.map(hall => (
                    <HallSessions key={hall.hallId} hall={hall} sessions={hall.sessions} currentDate={currentDate}/>
                ))}
            </div>
        </div>
    );
}

export default MovieCard;