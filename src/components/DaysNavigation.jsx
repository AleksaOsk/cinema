import {useState} from 'react';
import {getWeekDays, saveSelectedDate} from '../utils/dateHelpers';

function DaysNavigation({currentDate, onDateChange}) {
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });

    const [history, setHistory] = useState([]);
    const weekDays = getWeekDays(startDate);
    const hasPrev = history.length > 0;
    const daysToShow = hasPrev ? 5 : 6;

    const handlePrev = () => {
        if (history.length === 0) return;

        const prevHistory = [...history];
        const prevStartDate = prevHistory.pop();
        setHistory(prevHistory);
        setStartDate(prevStartDate);

        const newDays = getWeekDays(prevStartDate);
        if (newDays.length > 0) {
            onDateChange(newDays[0].date);
        }
    };

    const handleNext = () => {
        setHistory([...history, startDate]);

        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + daysToShow);
        setStartDate(newStartDate);

        const newDays = getWeekDays(newStartDate);
        if (newDays.length > 0) {
            onDateChange(newDays[0].date);
        }
    };

    return (
        <nav className="nav-days">
            <div className="container">
                <ul className="days-list">
                    {hasPrev && (
                        <button className="nav-arrow prev-days" onClick={handlePrev}>
                            &lt;
                        </button>
                    )}

                    {weekDays.slice(0, daysToShow).map(day => {
                        const isActive = day.date === currentDate;
                        const isWeekend = day.dayOfWeek === 'Сб' || day.dayOfWeek === 'Вс';
                        return (
                            <button
                                key={day.date}
                                className={`day-btn ${isActive ? 'active' : ''} ${isWeekend ? 'weekend' : ''}`}
                                onClick={() => {
                                    onDateChange(day.date);
                                    saveSelectedDate(day.date);
                                }}
                            >
                                <span className="day-week">{day.firstLine}</span>
                                <span className="day-date">{day.secondLine}</span>
                            </button>
                        );
                    })}

                    <button className="nav-arrow next-days" onClick={handleNext}>
                        &gt;
                    </button>
                </ul>
            </div>
        </nav>
    );
}

export default DaysNavigation;