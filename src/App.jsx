import {HashRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import BookingPage from './pages/BookingPage';
import TicketPage from './pages/TicketPage';
import ElectronicTicketPage from './pages/ElectronicTicketPage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/admin-login" element={<AdminLoginPage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/booking" element={<BookingPage/>}/>
                <Route path="/ticket" element={<TicketPage/>}/>
                <Route path="/electronic-ticket" element={<ElectronicTicketPage/>}/>
            </Routes>
        </HashRouter>
    );
}

export default App;