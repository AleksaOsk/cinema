import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Header from '../components/Header';
import HallScheme from '../components/HallScheme';
import {getAllData} from '../api/client';

function BookingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const seanceId = searchParams.get('seanceId');
    const date = searchParams.get('date');

    const [film, setFilm] = useState(null);
    const [hall, setHall] = useState(null);
    const [seance, setSeance] = useState(null);
    const [hallConfig, setHallConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [prices, setPrices] = useState({standart: 250, vip: 350});

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getAllData();

                const foundSeance = data.seances.find(s => s.id == seanceId);
                if (foundSeance) {
                    setSeance(foundSeance);

                    const foundFilm = data.films.find(f => f.id === foundSeance.seance_filmid);
                    setFilm(foundFilm);

                    const foundHall = data.halls.find(h => h.id === foundSeance.seance_hallid);
                    setHall(foundHall);

                    setPrices({
                        standart: foundHall.hall_price_standart,
                        vip: foundHall.hall_price_vip
                    });

                    const configUrl = `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${date}`;
                    const configResponse = await fetch(configUrl);
                    const configData = await configResponse.json();

                    if (configData.success) {
                        setHallConfig(configData.result);
                    } else {
                        setHallConfig(foundHall.hall_config);
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        };

        if (seanceId && date) {
            loadData();
        }
    }, [seanceId, date]);

    const handleSeatSelect = (row, place, type, isTaken) => {
        if (isTaken) return;

        const seatKey = `${row}_${place}`;
        const isSelected = selectedSeats.includes(seatKey);

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatKey));
        } else {
            setSelectedSeats([...selectedSeats, seatKey]);
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            alert('Выберите места');
            return;
        }

        const tickets = selectedSeats.map(seatKey => {
            const [row, place] = seatKey.split('_');
            const seatType = hallConfig[row - 1]?.[place - 1];
            const price = seatType === 'vip' ? prices.vip : prices.standart;
            return {row: parseInt(row), place: parseInt(place), coast: price};
        });

        console.log('Отправляем билеты:', tickets);

        const formData = new FormData();
        formData.append('seanceId', seanceId);
        formData.append('ticketDate', date);
        formData.append('tickets', JSON.stringify(tickets));

        try {
            const response = await fetch('https://shfe-diplom.neto-server.ru/ticket', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                let ticketsArray = null;

                if (data.result && Array.isArray(data.result.tickets)) {
                    ticketsArray = data.result.tickets;
                } else if (Array.isArray(data.result)) {
                    ticketsArray = data.result;
                } else if (data.tickets && Array.isArray(data.tickets)) {
                    ticketsArray = data.tickets;
                }

                if (ticketsArray && ticketsArray.length > 0) {
                    navigate('/ticket', {state: {tickets: ticketsArray}});
                } else {
                    alert('Билеты созданы, но не удалось получить данные. Проверьте консоль.');
                }
            } else {
                alert('Ошибка бронирования: ' + (data.error || 'Неизвестная ошибка'));
            }
        } catch (error) {
            console.error('Ошибка при бронировании:', error);
            alert('Ошибка при бронировании: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="booking-container-page">
                <Header/>
                <main className="main booking-page">
                    <div className="container">
                        <div className="loading">Загрузка схемы зала...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (!film || !hall || !hallConfig) {
        return (
            <div className="booking-container-page">
                <Header/>
                <main className="main booking-page">
                    <div className="container">
                        <div className="loading">Данные не найдены</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="booking-container-page">
            <Header/>
            <main className="main booking-page">
                <div className="booking-container">
                    <div className="booking-info">
                        <div className="booking-info-right">
                            <div className="booking-film-title">{film.film_name}</div>
                            <div className="booking-seance-time">Начало сеанса: {seance?.seance_time}</div>
                            <div className="booking-hall-name">{hall.hall_name}</div>
                        </div>
                        <div className="booking-tap-hint">
                            <img src="/images/tap.svg" alt="Тап" />
                            <span>Тапните дважды, чтобы увеличить</span>
                        </div>
                    </div>

                    <div className="booking-hall">
                        <HallScheme
                            hallConfig={hallConfig}
                            selectedSeats={selectedSeats}
                            onSeatSelect={handleSeatSelect}
                        />

                        <div className="booking-legend">
                            <div className="legend-column">
                                <div className="legend-item">
                                    <div className="legend-seat standart-free"></div>
                                    <span>Свободно ({prices.standart} руб)</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-seat vip-free"></div>
                                    <span>Свободно VIP ({prices.vip} руб)</span>
                                </div>
                            </div>
                            <div className="legend-column">
                                <div className="legend-item">
                                    <div className="legend-seat taken"></div>
                                    <span>Занято</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-seat selected"></div>
                                    <span>Выбрано</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="booking-footer">
                        <button className="booking-btn" onClick={handleBooking}>
                            ЗАБРОНИРОВАТЬ
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default BookingPage;