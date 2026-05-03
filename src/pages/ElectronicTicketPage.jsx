import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import Header from '../components/Header';
import QRCode from '../components/QRCode';

function ElectronicTicketPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [qrValue, setQrValue] = useState('');

    useEffect(() => {
        if (location.state && location.state.tickets && location.state.tickets.length > 0) {
            const firstTicket = location.state.tickets[0];
            setTicket(firstTicket);

            const qrData = {
                билет: firstTicket.id,
                фильм: firstTicket.ticket_filmname,
                ряд: firstTicket.ticket_row,
                место: firstTicket.ticket_place,
                зал: firstTicket.ticket_hallname,
                дата: firstTicket.ticket_date,
                время: firstTicket.ticket_time,
                цена: firstTicket.ticket_price
            };
            setQrValue(JSON.stringify(qrData));
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    if (!ticket) {
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
        return `${ticket.ticket_row}, ${ticket.ticket_place}`;
    };

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

                        <div className="ticket-qr">
                            <QRCode value={qrValue} size={200}/>
                        </div>

                        <div className="ticket-message">
                            Покажите QR-код нашему контроллеру для подтверждения бронирования.<br/>
                            Приятного просмотра!
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ElectronicTicketPage;