import {Link} from 'react-router-dom';

function HallSessions({hall, sessions, currentDate}) {
    return (
        <div className="hall-block">
            <div className="hall-title">{hall.hallName}</div>
            <div className="sessions-list">
                {sessions.map(session => {
                    if (session.isPassed) {
                        return (
                            <button
                                key={session.id}
                                className="session-time disabled"
                                disabled
                                style={{
                                    opacity: 0.5,
                                    cursor: 'not-allowed'
                                }}
                            >
                                <span>{session.time}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={session.id}
                            to={`/booking?seanceId=${session.id}&date=${currentDate}`}
                            className="session-time"
                        >
                            <span>{session.time}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default HallSessions;