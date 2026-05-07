export function getWeekDays(startDateParam = null) {
    const days = [];
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    let currentDate;
    if (startDateParam) {
        currentDate = new Date(startDateParam);
    } else {
        currentDate = new Date();
    }

    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);

        date.setHours(0, 0, 0, 0);

        const dayOfWeek = weekdays[date.getDay()];
        const dayOfMonth = date.getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = date.getTime() === today.getTime();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(dayOfMonth).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        days.push({
            date: dateStr,
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
    const [hours, minutes] = sessionTime.split(':').map(Number);
    const [year, month, day] = sessionDate.split('-').map(Number);
    const sessionDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return sessionDateTime < now;
}