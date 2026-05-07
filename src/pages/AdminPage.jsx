import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header';
import {getAllData} from '../api/client';
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
import DeleteConfirmModal from "../components/admin/DeleteConfirmModal";
import InfoModal from '../components/admin/InfoModal';

function AdminPage() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState({halls: [], films: [], seances: []});
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
    const [prices, setPrices] = useState({standart: 0, vip: 0});

    // Films & Seances
    const [showAddFilmModal, setShowAddFilmModal] = useState(false);
    const [newFilm, setNewFilm] = useState({name: '', duration: '', description: '', origin: ''});
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
    const [newSeance, setNewSeance] = useState({hallId: '', filmId: '', time: '00:00'});

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [seanceToDelete, setSeanceToDelete] = useState(null);
    const [showSalesModal, setShowSalesModal] = useState(false);
    const [salesMessage, setSalesMessage] = useState('');

    const [showHallDeleteConfirm, setShowHallDeleteConfirm] = useState(false);
    const [hallToDelete, setHallToDelete] = useState(null);
    const [showFilmDeleteConfirm, setShowFilmDeleteConfirm] = useState(false);
    const [filmToDelete, setFilmToDelete] = useState(null);

    const handleHallDeleteClick = (hallId) => {
        setHallToDelete(hallId);
        setShowHallDeleteConfirm(true);
    };

    const handleConfirmHallDelete = async () => {
        if (!hallToDelete) return;
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallToDelete}`, {method: 'DELETE'});
            const result = await response.json();
            if (result.success) {
                loadData();
                if (selectedHallId === hallToDelete) {
                    setSelectedHallId(null);
                    setSelectedHall(null);
                }
                showAlert('Зал успешно удалён');
            } else {
                showAlert('Ошибка удаления зала');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при удалении зала');
        }
        setShowHallDeleteConfirm(false);
        setHallToDelete(null);
    };

    const handleFilmDeleteClick = (filmId) => {
        setFilmToDelete(filmId);
        setShowFilmDeleteConfirm(true);
    };

    const handleConfirmFilmDelete = async () => {
        if (!filmToDelete) return;
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/film/${filmToDelete}`, {method: 'DELETE'});
            const result = await response.json();
            if (result.success) {
                loadData();
                showAlert('Фильм успешно удалён');
            } else {
                showAlert('Ошибка удаления фильма');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при удалении фильма');
        }
        setShowFilmDeleteConfirm(false);
        setFilmToDelete(null);
    };

    const [alertMessage, setAlertMessage] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const showAlert = (message) => {
        setAlertMessage(message);
        setShowAlertModal(true);
    };

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
        setOpenSections(prev => ({...prev, [section]: !prev[section]}));
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
            showAlert('Введите название зала');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('hallName', newHallName);
            const response = await fetch('https://shfe-diplom.neto-server.ru/hall', {method: 'POST', body: formData});
            const result = await response.json();
            if (result.success) {
                setShowAddHallModal(false);
                setNewHallName('');
                loadData();
            } else {
                showAlert('Ошибка создания зала');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при создании зала');
        }
    };

    const handleDeleteHall = async (hallId) => {
        if (!confirm('Вы уверены, что хотите удалить этот зал?')) return;
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {method: 'DELETE'});
            const result = await response.json();
            if (result.success) {
                loadData();
                if (selectedHallId === hallId) {
                    setSelectedHallId(null);
                    setSelectedHall(null);
                }
            } else {
                showAlert('Ошибка удаления зала');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при удалении зала');
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

    const handleRowsChange = (value) => {
        let numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1) {
            numValue = 1;
        }
        numValue = Math.min(numValue, 20);
        setRows(numValue);
    };

    const handlePlacesChange = (value) => {
        let numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1) {
            numValue = 1;
        }
        numValue = Math.min(numValue, 80);
        setPlaces(numValue);
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

    useEffect(() => {
        if (data.halls.length > 0 && !selectedHallId) {
            const firstHall = data.halls[0];
            selectHallForConfig(firstHall);
        }
    }, [data.halls, selectedHallId]);

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
            const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${selectedHall.id}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showAlert('Конфигурация сохранена');
                loadData();
            } else {
                showAlert('Ошибка сохранения');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при сохранении');
        }
    };

    // Price handlers
    const selectHallForPrices = (hall) => {
        setSelectedPriceHallId(hall.id);
        setSelectedPriceHall(hall);
        setPrices({standart: hall.hall_price_standart, vip: hall.hall_price_vip});
    };

    useEffect(() => {
        if (data.halls.length > 0 && !selectedHallId) {
            const firstHall = data.halls[0];
            selectHallForPrices(firstHall);
        }
    }, [data.halls, selectedHallId]);

    const savePrices = async () => {
        if (!selectedPriceHall) return;
        try {
            const formData = new FormData();
            formData.append('priceStandart', prices.standart);
            formData.append('priceVip', prices.vip);
            const response = await fetch(`https://shfe-diplom.neto-server.ru/price/${selectedPriceHall.id}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showAlert('Цены сохранены');
                loadData();
            } else {
                showAlert('Ошибка сохранения цен');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при сохранении цен');
        }
    };

    // Film handlers
    const handleAddFilm = async () => {
        if (!newFilm.name.trim()) {
            showAlert('Введите название фильма');
            return;
        }
        if (!newFilm.duration) {
            showAlert('Введите продолжительность фильма');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('filmName', newFilm.name);
            formData.append('filmDuration', newFilm.duration);
            formData.append('filmDescription', newFilm.description);
            formData.append('filmOrigin', newFilm.origin);
            if (posterFile) formData.append('filePoster', posterFile);
            const response = await fetch('https://shfe-diplom.neto-server.ru/film', {method: 'POST', body: formData});
            const result = await response.json();
            if (result.success) {
                setShowAddFilmModal(false);
                setNewFilm({name: '', duration: '', description: '', origin: ''});
                setPosterFile(null);
                loadData();
            } else {
                showAlert('Ошибка добавления фильма');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при добавлении фильма');
        }
    };

    const handleDeleteFilm = async (filmId) => {
        if (!confirm('Вы уверены, что хотите удалить этот фильм?')) return;
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/film/${filmId}`, {method: 'DELETE'});
            const result = await response.json();
            if (result.success) loadData();
            else showAlert('Ошибка удаления фильма');
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при удалении фильма');
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
        return {left, width};
    };

    const handleAddSeance = async (hallId, filmId, time) => {
        const film = getFilmById(filmId);
        if (!film) return;
        try {
            const formData = new FormData();
            formData.append('seanceHallid', hallId);
            formData.append('seanceFilmid', filmId);
            formData.append('seanceTime', time);
            const response = await fetch('https://shfe-diplom.neto-server.ru/seance', {method: 'POST', body: formData});
            const result = await response.json();
            if (result.success) loadData();
            else showAlert('Ошибка добавления сеанса');
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при добавлении сеанса');
        }
    };

    const handleDrop = (hallId, time) => {
        if (draggedFilm) {
            setSelectedHallForSeance({id: hallId});
            setNewSeance({
                hallId: hallId,
                filmId: draggedFilm.id,
                time: time
            });
            setShowAddSeanceModal(true);
            setDraggedFilm(null);
        }
    };

    const handleSeanceDrop = async (hallId, newTime) => {
        if (!draggedSeance) return;
        const film = getFilmById(draggedSeance.seance_filmid);
        if (!film) return;
        try {
            await fetch(`https://shfe-diplom.neto-server.ru/seance/${draggedSeance.id}`, {method: 'DELETE'});
            const formData = new FormData();
            formData.append('seanceHallid', hallId);
            formData.append('seanceFilmid', draggedSeance.seance_filmid);
            formData.append('seanceTime', newTime);
            await fetch('https://shfe-diplom.neto-server.ru/seance', {method: 'POST', body: formData});
            loadData();
        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Ошибка при перемещении сеанса');
        }
        setDraggedSeance(null);
        setShowTrash(false);
    };

    const handleTrashClick = (seance) => {
        setSeanceToDelete(seance);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!seanceToDelete) return;
        try {
            await fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceToDelete.id}`, {method: 'DELETE'});
            loadData();
            setShowDeleteConfirm(false);
            setSeanceToDelete(null);
        } catch (error) {
            console.error('Ошибка:', error);
            setSalesMessage('Ошибка при удалении сеанса');
            setShowSalesModal(true);
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

    useEffect(() => {
        if (data.halls.length > 0 && !selectedHallId) {
            const firstHall = data.halls[0];
            selectHallForSales(firstHall);
        }
    }, [data.halls, selectedHallId]);

    const toggleHallSales = async () => {
        if (!selectedSalesHall) return;
        const newStatus = selectedSalesHall.hall_open === 1 ? 0 : 1;
        try {
            const formData = new FormData();
            formData.append('hallOpen', newStatus);
            const response = await fetch(`https://shfe-diplom.neto-server.ru/open/${selectedSalesHall.id}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                setSelectedSalesHall(prev => ({...prev, hall_open: newStatus}));

                setData(prevData => ({
                    ...prevData,
                    halls: prevData.halls.map(hall =>
                        hall.id === selectedSalesHall.id
                            ? {...hall, hall_open: newStatus}
                            : hall
                    )
                }));

                setSalesMessage(newStatus === 1 ? 'Продажи успешно открыты' : 'Продажи успешно закрыты');
                setShowSalesModal(true);
            } else {
                setSalesMessage('Ошибка изменения статуса продаж');
                setShowSalesModal(true);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setSalesMessage('Ошибка при изменении статуса продаж');
            setShowSalesModal(true);
        }
    };

    if (!isAdmin || loading) {
        return (
            <div className="admin-container-page admin-layout">
                <Header showAdminSubtitle={true}/>
                <main className="main">
                    <div className="loading">Загрузка...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="admin-container-page admin-layout">
            <Header showAdminSubtitle={true}/>
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
                            onDeleteHall={handleHallDeleteClick}
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
                            onRowsChange={handleRowsChange}
                            places={places}
                            onPlacesChange={handlePlacesChange}
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
                            onPriceChange={(type, value) => {
                                let numValue = Number(value);
                                if (isNaN(numValue)) numValue = 0;
                                if (numValue <= 0) numValue = 1;
                                setPrices(prev => ({...prev, [type]: numValue}));
                            }}
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
                            onDeleteFilm={handleFilmDeleteClick}
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
                            onTrashClick={handleTrashClick}
                            onTimeClick={(hall) => {
                                setSelectedHallForSeance(hall);
                                setNewSeance({hallId: hall.id, filmId: '', time: '00:00'});
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

            {/* Модалка для обычных сообщений */}
            {showAlertModal && (
                <InfoModal
                    message={alertMessage}
                    onClose={() => setShowAlertModal(false)}
                />
            )}

            {/* Модалка подтверждения удаления зала */}
            {showHallDeleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={handleConfirmHallDelete}
                    onClose={() => {
                        setShowHallDeleteConfirm(false);
                        setHallToDelete(null);
                    }}
                    itemName="зал"
                />
            )}

            {/* Модалка подтверждения удаления фильма */}
            {showFilmDeleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={handleConfirmFilmDelete}
                    onClose={() => {
                        setShowFilmDeleteConfirm(false);
                        setFilmToDelete(null);
                    }}
                    itemName="фильм"
                />
            )}

            {showDeleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={handleConfirmDelete}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setSeanceToDelete(null);
                    }}
                    itemName="сеанс"
                />
            )}

            {showSalesModal && (
                <InfoModal
                    message={salesMessage}
                    onClose={() => setShowSalesModal(false)}
                />
            )}

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
                    onFilmChange={(field, value) => setNewFilm(prev => ({...prev, [field]: value}))}
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
                    onSeanceChange={(field, value) => setNewSeance(prev => ({...prev, [field]: value}))}
                    onAdd={() => {
                        if (!newSeance.filmId) {
                            showAlert('Выберите фильм');
                            return;
                        }
                        if (!newSeance.hallId) {
                            showAlert('Выберите зал');
                            return;
                        }
                        if (!newSeance.time) {
                            showAlert('Выберите время');
                            return;
                        }
                        handleAddSeance(newSeance.hallId, newSeance.filmId, newSeance.time);
                        setShowAddSeanceModal(false);
                        setNewSeance({hallId: '', filmId: '', time: '00:00'});
                        setSelectedHallForSeance(null);
                    }}
                    onClose={() => {
                        setShowAddSeanceModal(false);
                        setNewSeance({hallId: '', filmId: '', time: '00:00'});
                        setSelectedHallForSeance(null);
                    }}
                />
            )}
        </div>
    );
}

export default AdminPage;