import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header';
import DaysNavigation from '../components/DaysNavigation';
import MovieList from '../components/MovieList';
import {useCinemaData} from '../hooks/useCinemaData';
import {getSelectedDate} from '../utils/dateHelpers';

function HomePage() {
    const navigate = useNavigate();
    const {data, loading, error} = useCinemaData();
    const [currentDate, setCurrentDate] = useState(getSelectedDate());

    const handleLoginClick = () => {
        navigate('/admin-login');
    };

    if (loading) {
        return (
            <div className="home-container-page">
                <Header showLogin={true} showAdminSubtitle={false} onLoginClick={handleLoginClick}/>
                <main className="main">
                    <div className="container">
                        <div className="loading">Загрузка...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-container-page">
                <Header showLogin={true} showAdminSubtitle={false} onLoginClick={handleLoginClick}/>
                <main className="main">
                    <div className="container">
                        <div className="loading">Ошибка загрузки данных. Попробуйте позже.</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="home-container-page">
            <Header showLogin={true} showAdminSubtitle={false} onLoginClick={handleLoginClick}/>
            <DaysNavigation
                currentDate={currentDate}
                onDateChange={setCurrentDate}
            />
            <main className="main">
                <div className="container">
                    <MovieList
                        films={data.films}
                        seances={data.seances}
                        halls={data.halls}
                        currentDate={currentDate}
                    />
                </div>
            </main>
        </div>
    );
}

export default HomePage;