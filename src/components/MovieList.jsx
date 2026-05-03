import MovieCard from './MovieCard';
import {formatTime, isSessionPassed} from '../utils/dateHelpers';

function MovieList({films, seances, halls, currentDate}) {
    const getFilmSessions = (filmId, date) => {
        const filmSeances = seances.filter(s => s.seance_filmid === filmId);
        const sessionsByHall = {};

        filmSeances.forEach(seance => {
            const hall = halls.find(h => h.id === seance.seance_hallid);
            if (!hall || hall.hall_open !== 1) return;

            const sessionTime = formatTime(seance.seance_time);
            const isPassed = isSessionPassed(sessionTime, date);

            if (!sessionsByHall[hall.id]) {
                sessionsByHall[hall.id] = {
                    hallName: hall.hall_name,
                    hallId: hall.id,
                    sessions: []
                };
            }
            sessionsByHall[hall.id].sessions.push({
                id: seance.id,
                time: sessionTime,
                isPassed
            });
        });

        return Object.values(sessionsByHall).sort((a, b) => a.hallId - b.hallId);
    };

    const filmsWithSessions = films.filter(film => getFilmSessions(film.id, currentDate).length > 0);

    if (filmsWithSessions.length === 0) {
        return <div className="loading">Нет сеансов на выбранную дату</div>;
    }

    return (
        <div className="movies-list">
            {filmsWithSessions.map(film => (
                <MovieCard
                    key={film.id}
                    film={film}
                    sessionsByHall={getFilmSessions(film.id, currentDate)}
                    currentDate={currentDate}
                />
            ))}
        </div>
    );
}

export default MovieList;