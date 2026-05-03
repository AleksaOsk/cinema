export function getWeekDays(startDateParam = null) {
    const days = [];
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    let currentDate;
    if (startDateParam) {
        currentDate = new Date(startDateParam);
    } else {
        currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
    }

    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);

        const dayOfWeek = weekdays[date.getDay()];
        const dayOfMonth = date.getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = date.getTime() === today.getTime();

        days.push({
            date: date.toISOString().split('T')[0],
            firstLine: isToday ? 'Сегодня' : `${dayOfWeek},`,
            secondLine: isToday ? `${dayOfWeek}, ${dayOfMonth}` : `${dayOfMonth}`,
            dayOfWeek: dayOfWeek,
            isToday: isToday
        });
    }
    return days;
}

export function formatTime(timeStr) {
    return timeStr.substring(0, 5);
}

export function getSelectedDate() {
    const saved = localStorage.getItem('selectedDate');
    if (saved) return saved;
    return new Date().toISOString().split('T')[0];
}

export function saveSelectedDate(date) {
    localStorage.setItem('selectedDate', date);
}

export function isSessionPassed(sessionTime, sessionDate) {
    const now = new Date();
    const sessionDateTime = new Date(`${sessionDate}T${sessionTime}`);
    return sessionDateTime < now;
}