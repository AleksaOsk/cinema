import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getAllData } from '../api/client';
import AdminSection from '../components/admin/AdminSection';
import HallsManager from '../components/admin/HallsManager';
import HallConfigurator from '../components/admin/HallConfigurator';
import PriceManager from '../components/admin/PriceManager';
import FilmsManager from '../components/admin/FilmsManager';
import SeancesTimeline from '../components/admin/SeancesTimeline';
import SalesManager from '../components/admin/SalesManager';
import AddHallModal from '../components/admin/AddHallModal';
import AddFilmModal from '../components/admin/AddFilmModal';
import AddSeanceModal from '../components/admin/AddSeanceModal';

function AdminPage() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState({ halls: [], films: [], seances: [] });
    const [loading, setLoading] = useState(true);
    const [seances, setSeances] = useState([]);

    const [openSections, setOpenSections] = useState({
        halls: true, config: false, films: false, prices: false, seances: false
    });
    const sectionsOrder = ['halls', 'config', 'films', 'prices', 'seances'];

    // Halls
    const [showAddHallModal, setShowAddHallModal] = useState(false);
    const [newHallName, setNewHallName] = useState('');

    // Config
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [selectedHall, setSelectedHall] = useState(null);
    const [rows, setRows] = useState(5);
    const [places, setPlaces] = useState(6);
    const [hallConfig, setHallConfig] = useState([]);

    // Prices
    const [selectedPriceHallId, setSelectedPriceHallId] = useState(null);
    const [selectedPriceHall, setSelectedPriceHall] = useState(null);
    const [prices, setPrices] = useState({ standart: 0, vip: 0 });

    // Films & Seances
    const [showAddFilmModal, setShowAddFilmModal] = useState(false);
    const [newFilm, setNewFilm] = useState({ name: '', duration: '', description: '', origin: '' });
    const [posterFile, setPosterFile] = useState(null);
    const [draggedFilm, setDraggedFilm] = useState(null);
    const [draggedSeance, setDraggedSeance] = useState(null);
    const [showTrash, setShowTrash] = useState(false);
    const [dragSourceHallId, setDragSourceHallId] = useState(null);

    // Sales
    const [selectedSalesHallId, setSelectedSalesHallId] = useState(null);
    const [selectedSalesHall, setSelectedSalesHall] = useState(null);

    // Add Seance
    const [showAddSeanceModal, setShowAddSeanceModal] = useState(false);
    const [selectedHallForSeance, setSelectedHallForSeance] = useState(null);
    const [newSeance, setNewSeance] = useState({ hallId: '', filmId: '', time: '00:00' });

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin');
        if (adminStatus !== 'true') {
            navigate('/admin-login');
        } else {
            setIsAdmin(true);
            loadData();
        }
    }, [navigate]);

    const loadData = async () => {
        try {
            const result = await getAllData();
            setData(result);
            setSeances(result.seances || []);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const showHeaderLineUp = (section) => {
        const currentIndex = sectionsOrder.indexOf(section);
        if (currentIndex > 0) {
            const prevSection = sectionsOrder[currentIndex - 1];
            return openSections[prevSection];
        }
        return false;
    };

    const showHeaderLineDown = (section) => {
        return openSections[section];
    };

    // Halls handlers
    const handleCreateHall = async () => {
        if (!newHallName.trim()) {
            alert('Введите название зала');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('hallName', newHallName);
            const response = await fetch('https://shfe-diplom.neto-server.ru/hall', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                setShowAddHallModal(false);
                setNewHallName('');
                loadData();
            } else {
                alert('Ошибка создания зала');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при создании зала');
        }
    };

    const handleDeleteHall = async (hallId) => {
        if (!confirm('Вы уверены, что хотите удалить этот зал?')) return;
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                loadData();
                if (selectedHallId === hallId) {
                    setSelectedHallId(null);
                    setSelectedHall(null);
                }
            } else {
                alert('Ошибка удаления зала');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении зала');
        }
    };

    // Config handlers
    const selectHallForConfig = (hall) => {
        setSelectedHallId(hall.id);
        setSelectedHall(hall);
        setRows(hall.hall_rows);
        setPlaces(hall.hall_places);
        let config = hall.hall_config;
        if (!config || config.length === 0) {
            config = Array(rows).fill().map(() => Array(places).fill('standart'));
        }
        setHallConfig(config);
    };

    useEffect(() => {
        if (selectedHall) {
            const newConfig = Array(rows).fill().map(() => Array(places).fill('standart'));
            for (let i = 0; i < Math.min(rows, hallConfig.length); i++) {
                for (let j = 0; j < Math.min(places, hallConfig[i]?.length || 0); j++) {
                    newConfig[i][j] = hallConfig[i][j];
                }
            }
            setHallConfig(newConfig);
        }
    }, [rows, places]);

    const updateSeatType = (row, place) => {
        const newConfig = [...hallConfig];
        const currentType = newConfig[row][place];
        if (currentType === 'standart') newConfig[row][place] = 'vip';
        else if (currentType === 'vip') newConfig[row][place] = 'disabled';
        else newConfig[row][place] = 'standart';
        setHallConfig(newConfig);
    };

    const saveHallConfig = async () => {
        if (!selectedHall) return;
        try {
            const formData = new FormData();
            formData.append('rowCount', rows);
            formData.append('placeCount', places);
            formData.append('config', JSON.stringify(hallConfig));
            const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${selectedHall.id}`, { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                alert('Конфигурация сохранена');
                loadData();
            } else {
                alert('Ошибка сохранения');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении');
        }
    };

    // Price handlers
    const selectHallForPrices = (hall) => {
        setSelectedPriceHallId(hall.id);
        setSelectedPriceHall(hall);
        setPrices({ standart: hall.hall_price_standart, vip: hall.hall_price_vip });
    };

    const savePrices = async () => {
        if (!selectedPriceHall) return;
        try {
            const formData = new FormData();
            formData.append('priceStandart', prices.standart);
            formData.append('priceVip', prices.vip);
            const response = await fetch(`https://shfe-diplom.neto-server.ru/price/${selectedPriceHall.id}`, { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                alert('Цены сохранены');
                loadData();
            } else {
                alert('Ошибка сохранения цен');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении цен');
        }
    };

    // Film handlers
    const handleAddFilm = async () => {
        if (!newFilm.name.trim()) {
            alert('Введите название фильма');
            return;
        }
        if (!newFilm.duration) {
            alert('Введите продолжительность фильма');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('filmName', newFilm.name);
            formData.append('filmDuration', newFilm.duration);
            formData.append('filmDescription', newFilm.description);
            formData.append('filmOrigin', newFilm.origin);
            if (posterFile) formData.append('filePoster', posterFile);
            const response = await fetch('https://shfe-diplom.neto-server.ru/film', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                setShowAddFilmModal(false);
                setNewFilm({ name: '', duration: '', description: '', origin: '' });
                setPosterFile(null);
                loadData();
            } else {
                alert('Ошибка добавления фильма');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при добавлении фильма');
        }
    };

    const handleDeleteFilm = async (filmId) => {
        if (!confirm('Вы уверены, что хотите удалить этот фильм?')) return;
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/film/${filmId}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) loadData();
            else alert('Ошибка удаления фильма');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении фильма');
        }
    };

    // Seance helpers
    const getSeancesForHall = (hallId) => seances.filter(s => s.seance_hallid === hallId);
    const getFilmById = (filmId) => data.films.find(f => f.id === filmId);
    const getSeancePosition = (startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const left = (startMinutes / (24 * 60)) * 100;
        const width = (duration / (24 * 60)) * 100;
        return { left, width };
    };

    const handleAddSeance = async (hallId, filmId, time) => {
        const film = getFilmById(filmId);
        if (!film) return;
        try {
            const formData = new FormData();
            formData.append('seanceHallid', hallId);
            formData.append('seanceFilmid', filmId);
            formData.append('seanceTime', time);
            const response = await fetch('https://shfe-diplom.neto-server.ru/seance', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) loadData();
            else alert('Ошибка добавления сеанса');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при добавлении сеанса');
        }
    };

    const handleDrop = (hallId, time) => {
        if (draggedFilm) {
            handleAddSeance(hallId, draggedFilm.id, time);
            setDraggedFilm(null);
        }
    };

    const handleSeanceDrop = async (hallId, newTime) => {
        if (!draggedSeance) return;
        const film = getFilmById(draggedSeance.seance_filmid);
        if (!film) return;
        try {
            await fetch(`https://shfe-diplom.neto-server.ru/seance/${draggedSeance.id}`, { method: 'DELETE' });
            const formData = new FormData();
            formData.append('seanceHallid', hallId);
            formData.append('seanceFilmid', draggedSeance.seance_filmid);
            formData.append('seanceTime', newTime);
            await fetch('https://shfe-diplom.neto-server.ru/seance', { method: 'POST', body: formData });
            loadData();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при перемещении сеанса');
        }
        setDraggedSeance(null);
        setShowTrash(false);
    };

    const handleTrashDrop = async () => {
        if (!draggedSeance) return;
        if (confirm('Удалить сеанс?')) {
            try {
                await fetch(`https://shfe-diplom.neto-server.ru/seance/${draggedSeance.id}`, { method: 'DELETE' });
                loadData();
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при удалении сеанса');
            }
        }
        setDraggedSeance(null);
        setShowTrash(false);
    };

    const handleDragEnd = () => {
        setDraggedSeance(null);
        setDraggedFilm(null);
        setDragSourceHallId(null);
        setShowTrash(false);
    };

    const handleDragOver = (e) => e.preventDefault();

    // Sales handlers
    const selectHallForSales = (hall) => {
        setSelectedSalesHallId(hall.id);
        setSelectedSalesHall(hall);
    };

    const toggleHallSales = async () => {
        if (!selectedSalesHall) return;
        const newStatus = selectedSalesHall.hall_open === 1 ? 0 : 1;
        try {
            const formData = new FormData();
            formData.append('hallOpen', newStatus);
            const response = await fetch(`https://shfe-diplom.neto-server.ru/open/${selectedSalesHall.id}`, { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                alert(newStatus === 1 ? 'Продажи открыты' : 'Продажи закрыты');
                loadData();
                const updatedHall = data.halls.find(h => h.id === selectedSalesHall.id);
                setSelectedSalesHall(updatedHall);
            } else {
                alert('Ошибка изменения статуса продаж');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при изменении статуса продаж');
        }
    };

    if (!isAdmin || loading) {
        return (
            <div className="admin-container-page admin-layout">
                <Header showAdminSubtitle={true} />
                <main className="main">
                    <div className="loading">Загрузка...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="admin-container-page admin-layout">
            <Header showAdminSubtitle={true} />
            <main className="admin-main">
                <div className="admin-content">
                    <AdminSection
                        id="halls"
                        title="УПРАВЛЕНИЕ ЗАЛАМИ"
                        isOpen={openSections.halls}
                        onToggle={toggleSection}
                        showLineUp={showHeaderLineUp('halls')}
                        showLineDown={showHeaderLineDown('halls')}
                    >
                        <HallsManager
                            halls={data.halls}
                            onDeleteHall={handleDeleteHall}
                            onCreateHall={() => setShowAddHallModal(true)}
                        />
                    </AdminSection>

                    <AdminSection
                        id="config"
                        title="КОНФИГУРАЦИЯ ЗАЛОВ"
                        isOpen={openSections.config}
                        onToggle={toggleSection}
                        showLineUp={showHeaderLineUp('config')}
                        showLineDown={showHeaderLineDown('config')}
                    >
                        <HallConfigurator
                            halls={data.halls}
                            selectedHallId={selectedHallId}
                            onSelectHall={selectHallForConfig}
                            selectedHall={selectedHall}
                            rows={rows}
                            onRowsChange={setRows}
                            places={places}
                            onPlacesChange={setPlaces}
                            hallConfig={hallConfig}
                            onUpdateSeat={updateSeatType}
                            onSave={saveHallConfig}
                            onCancel={() => selectHallForConfig(selectedHall)}
                        />
                    </AdminSection>

                    <AdminSection
                        id="films"
                        title="КОНФИГУРАЦИЯ ЦЕН"
                        isOpen={openSections.films}
                        onToggle={toggleSection}
                        showLineUp={showHeaderLineUp('films')}
                        showLineDown={showHeaderLineDown('films')}
                    >
                        <PriceManager
                            halls={data.halls}
                            selectedHallId={selectedPriceHallId}
                            onSelectHall={selectHallForPrices}
                            prices={prices}
                            onPriceChange={(type, value) => setPrices(prev => ({ ...prev, [type]: value }))}
                            onSave={savePrices}
                            onCancel={() => selectHallForPrices(selectedPriceHall)}
                        />
                    </AdminSection>

                    <AdminSection
                        id="prices"
                        title="СЕТКА СЕАНСОВ"
                        isOpen={openSections.prices}
                        onToggle={toggleSection}
                        showLineUp={showHeaderLineUp('prices')}
                        showLineDown={showHeaderLineDown('prices')}
                    >
                        <FilmsManager
                            films={data.films}
                            onDragStart={(film) => setDraggedFilm(film)}
                            onDeleteFilm={handleDeleteFilm}
                            onAddFilm={() => setShowAddFilmModal(true)}
                        />
                        <SeancesTimeline
                            halls={data.halls}
                            seances={seances}
                            films={data.films}
                            draggedFilm={draggedFilm}
                            draggedSeance={draggedSeance}
                            showTrash={showTrash}
                            dragSourceHallId={dragSourceHallId}
                            onDragOver={handleDragOver}
                            onDragStartFilm={setDraggedFilm}
                            onDragStartSeance={(seance, hallId) => {
                                setDraggedSeance(seance);
                                setDragSourceHallId(hallId);
                                setShowTrash(true);
                            }}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDrop}
                            onSeanceDrop={handleSeanceDrop}
                            onTrashDrop={handleTrashDrop}
                            onTimeClick={(hall) => {
                                setSelectedHallForSeance(hall);
                                setNewSeance({ hallId: hall.id, filmId: '', time: '00:00' });
                                setShowAddSeanceModal(true);
                            }}
                            getSeancesForHall={getSeancesForHall}
                            getFilmById={getFilmById}
                            getSeancePosition={getSeancePosition}
                        />
                        <div className="admin-config-buttons">
                            <button className="admin-cancel-btn">ОТМЕНА</button>
                            <button className="admin-save-btn">СОХРАНИТЬ</button>
                        </div>
                    </AdminSection>

                    <AdminSection
                        id="seances"
                        title="ОТКРЫТЬ ПРОДАЖИ"
                        isOpen={openSections.seances}
                        onToggle={toggleSection}
                        showLineUp={showHeaderLineUp('seances')}
                        showLineDown={false}
                        showBodyLine={false}
                    >
                        <SalesManager
                            halls={data.halls}
                            selectedHallId={selectedSalesHallId}
                            onSelectHall={selectHallForSales}
                            selectedHall={selectedSalesHall}
                            onToggleSales={toggleHallSales}
                        />
                    </AdminSection>
                </div>
            </main>

            {showAddHallModal && (
                <AddHallModal
                    hallName={newHallName}
                    onHallNameChange={setNewHallName}
                    onClose={() => setShowAddHallModal(false)}
                    onAdd={handleCreateHall}
                />
            )}

            {showAddFilmModal && (
                <AddFilmModal
                    film={newFilm}
                    onFilmChange={(field, value) => setNewFilm(prev => ({ ...prev, [field]: value }))}
                    posterFile={posterFile}
                    onPosterSelect={(e) => e.target.files[0] && setPosterFile(e.target.files[0])}
                    onPosterDelete={() => setPosterFile(null)}
                    onAdd={handleAddFilm}
                    onClose={() => setShowAddFilmModal(false)}
                />
            )}

            {showAddSeanceModal && (
                <AddSeanceModal
                    seance={newSeance}
                    halls={data.halls}
                    films={data.films}
                    onSeanceChange={(field, value) => setNewSeance(prev => ({ ...prev, [field]: value }))}
                    onAdd={() => {
                        if (!newSeance.filmId) {
                            alert('Выберите фильм');
                            return;
                        }
                        handleAddSeance(newSeance.hallId, newSeance.filmId, newSeance.time);
                        setShowAddSeanceModal(false);
                    }}
                    onClose={() => setShowAddSeanceModal(false)}
                />
            )}
        </div>
    );
}

export default AdminPage;