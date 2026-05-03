import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Header from '../components/Header';

function TicketPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        if (location.state && location.state.tickets) {
            setTickets(location.state.tickets);
            console.log('Получены билеты из state:', location.state.tickets);
        } else {
            console.error('Нет данных о билетах');
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleGetCode = () => {
        navigate('/electronic-ticket', {state: {tickets: tickets}});
    };

    if (tickets.length === 0) {
        return (
            <div className="ticket-container-page">
                <Header/>
                <main className="main ticket-page">
                    <div className="ticket-container">
                        <div className="loading">Загрузка билета...</div>
                    </div>
                </main>
            </div>
        );
    }

    const ticket = tickets[0];

    const getSeatsString = () => {
        return tickets.map(t => `${t.ticket_row}, ${t.ticket_place}`).join('; ');
    };

    const totalPrice = tickets.reduce((sum, t) => sum + t.ticket_price, 0);

    return (
        <div className="ticket-container-page">
            <Header/>
            <main className="main ticket-page">
                <div className="ticket-container">
                    <div className="ticket-header">
                        <h2 className="ticket-title">ВЫ ВЫБРАЛИ БИЛЕТЫ:</h2>
                    </div>
                    <div className="ticket-dotted"></div>
                    <div className="ticket-body">
                        <div className="ticket-info-row">
                            <span className="ticket-label">На фильм: </span>
                            <span className="ticket-value">{ticket.ticket_filmname}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">Места: </span>
                            <span className="ticket-value">{getSeatsString()}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">В зале: </span>
                            <span className="ticket-value">{ticket.ticket_hallname}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">Начало сеанса: </span>
                            <span className="ticket-value">{ticket.ticket_time}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">Стоимость: </span>
                            <span className="ticket-value">{totalPrice}</span>
                            <span className="ticket-label"> рублей</span>
                        </div>

                        <button className="ticket-btn" onClick={handleGetCode}>
                            ПОЛУЧИТЬ КОД БРОНИРОВАНИЯ
                        </button>

                        <div className="ticket-message">
                            После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
                            Покажите QR-код нашему контроллёру у входа в зал.<br/>
                            Приятного просмотра!
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TicketPage;