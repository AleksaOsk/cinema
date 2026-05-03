import {Link} from 'react-router-dom';

function HallSessions({hall, sessions, currentDate}) {
    return (
        <div className="hall-block">
            <div className="hall-title">{hall.hallName}</div>
            <div className="sessions-list">
                {sessions.map(session => (
                    <Link
                        key={session.id}
                        to={`/booking?seanceId=${session.id}&date=${currentDate}`}
                        className={`session-time ${session.isPassed ? 'disabled' : ''}`}
                        style={session.isPassed ? {opacity: 0.5, pointerEvents: 'none'} : {}}
                    >
                        <span>{session.time}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HallSessions;