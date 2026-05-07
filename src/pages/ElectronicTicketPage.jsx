import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import Header from '../components/Header';
import QRCode from '../components/QRCode';

function ElectronicTicketPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [qrValue, setQrValue] = useState('');

    useEffect(() => {
        if (location.state && location.state.tickets && location.state.tickets.length > 0) {
            setTickets(location.state.tickets);

            const allSeats = location.state.tickets.map(t => `${t.ticket_row}, ${t.ticket_place}`).join('; ');
            const totalPrice = location.state.tickets.reduce((sum, t) => sum + t.ticket_price, 0);

            const qrData = {
                заказ: location.state.tickets.map(t => t.id).join(','),
                фильм: location.state.tickets[0].ticket_filmname,
                места: allSeats,
                зал: location.state.tickets[0].ticket_hallname,
                дата: location.state.tickets[0].ticket_date,
                время: location.state.tickets[0].ticket_time,
                цена: totalPrice,
                количество: location.state.tickets.length
            };
            setQrValue(JSON.stringify(qrData));
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    if (tickets.length === 0) {
        return (
            <div className="ticket-container-page">
                <Header/>
                <main className="main ticket-page">
                    <div className="ticket-container">
                        <div className="loading">Загрузка...</div>
                    </div>
                </main>
            </div>
        );
    }

    const getSeatsString = () => {
        return tickets.map(t => `${t.ticket_row}, ${t.ticket_place}`).join('; ');
    };

    const totalPrice = tickets.reduce((sum, t) => sum + t.ticket_price, 0);
    const firstTicket = tickets[0];

    return (
        <div className="ticket-container-page">
            <Header/>
            <main className="main ticket-page">
                <div className="ticket-container">
                    <div className="ticket-header">
                        <h2 className="ticket-title">ЭЛЕКТРОННЫЙ БИЛЕТ</h2>
                    </div>

                    <div className="ticket-dotted"></div>

                    <div className="ticket-body">
                        <div className="ticket-info-row">
                            <span className="ticket-label">На фильм: </span>
                            <span className="ticket-value">{firstTicket.ticket_filmname}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">Места: </span>
                            <span className="ticket-value">{getSeatsString()}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">В зале: </span>
                            <span className="ticket-value">{firstTicket.ticket_hallname}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">Начало сеанса: </span>
                            <span className="ticket-value">{firstTicket.ticket_time}</span>
                        </div>
                        <div className="ticket-info-row">
                            <span className="ticket-label">Стоимость: </span>
                            <span className="ticket-value">{totalPrice}</span>
                            <span className="ticket-label"> рублей</span>
                        </div>

                        <div className="ticket-qr">
                            <QRCode value={qrValue} size={200}/>
                        </div>

                        <div className="ticket-message">
                            Покажите QR-код нашему контроллеру для подтверждения бронирования.
                        </div>
                        <div className="ticket-message" style={{marginTop: '10px'}}>
                            Приятного просмотра!
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ElectronicTicketPage;