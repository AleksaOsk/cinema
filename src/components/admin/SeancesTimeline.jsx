function SeancesTimeline({
                             halls,
                             seances,
                             films,
                             draggedFilm,
                             draggedSeance,
                             showTrash,
                             dragSourceHallId,
                             onDragOver,
                             onDragStartFilm,
                             onDragStartSeance,
                             onDragEnd,
                             onDrop,
                             onSeanceDrop,
                             onTrashDrop,
                             onTimeClick,
                             getSeancesForHall,
                             getFilmById,
                             getSeancePosition
                         }) {
    return (
        <div className="admin-seances-timelines">
            {halls.map(hall => {
                const hallSeances = getSeancesForHall(hall.id);
                return (
                    <div key={hall.id} className="admin-timeline-hall">
                        <div className="admin-timeline-title">{hall.hall_name}</div>
                        <div className="admin-timeline-wrapper">
                            <div style={{width: '35px', flexShrink: 0}}>
                                {showTrash && dragSourceHallId === hall.id && (
                                    <div
                                        className="admin-timeline-trash"
                                        onDragOver={onDragOver}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            onTrashDrop();
                                        }}
                                    >
                                        <img src="./images/trash.svg" alt="Удалить"/>
                                    </div>
                                )}
                            </div>

                            <div className="admin-timeline-track-wrapper">
                                <div
                                    className="admin-timeline-track"
                                    onDragOver={onDragOver}
                                    onClick={(e) => {
                                        const isSeance = e.target.closest('.admin-timeline-seance');
                                        if (!isSeance) {
                                            onTimeClick(hall);
                                        }
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const trackElement = e.currentTarget;
                                        const rect = trackElement.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const percent = Math.max(0, Math.min(1, x / rect.width));
                                        let totalMinutes = percent * 24 * 60;
                                        totalMinutes = Math.round(totalMinutes / 5) * 5;
                                        if (totalMinutes >= 24 * 60) totalMinutes = 23 * 60 + 55;
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                                        if (draggedFilm) {
                                            onDrop(hall.id, time);
                                        } else if (draggedSeance) {
                                            onSeanceDrop(hall.id, time);
                                        }
                                    }}
                                >
                                    <div className="admin-timeline-seances">
                                        {hallSeances.map(seance => {
                                            const film = getFilmById(seance.seance_filmid);
                                            if (!film) return null;
                                            const {left, width} = getSeancePosition(seance.seance_time, film.film_duration);
                                            const filmIndex = films.findIndex(f => f.id === film.id);
                                            return (
                                                <div
                                                    key={seance.id}
                                                    className="admin-timeline-seance"
                                                    style={{
                                                        left: `${left}%`,
                                                        width: `${width}%`,
                                                        backgroundColor: `hsl(${filmIndex * 40 % 360}, 60%, 85%)`,
                                                        borderColor: `hsl(${filmIndex * 40 % 360}, 60%, 35%)`
                                                    }}
                                                    draggable
                                                    onDragStart={() => onDragStartSeance(seance, hall.id)}
                                                    onDragEnd={onDragEnd}
                                                >
                                                    <span>{film.film_name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="admin-timeline-markers-container">
                                    <div className="admin-timeline-markers">
                                        {hallSeances.map(seance => {
                                            const film = getFilmById(seance.seance_filmid);
                                            if (!film) return null;
                                            const [h, m] = seance.seance_time.split(':').map(Number);
                                            const startMinutes = h * 60 + m;
                                            const left = (startMinutes / (24 * 60)) * 100;
                                            return (
                                                <div key={seance.id} className="admin-timeline-marker" style={{left: `${left}%`}}>
                                                    <div className="admin-timeline-marker-line"></div>
                                                    <div className="admin-timeline-marker-time">{seance.seance_time}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SeancesTimeline;