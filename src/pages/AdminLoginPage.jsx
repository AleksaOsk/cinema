import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header';

function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('login', email);
            formData.append('password', password);

            const response = await fetch('https://shfe-diplom.neto-server.ru/login', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('adminLogin', email);
                navigate('/admin');
            } else {
                setError('Неверный email или пароль');
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container-page admin-layout">
            <Header showAdminSubtitle={true}/>
            <main className="main">
                <div className="admin-login-container">
                    <div className="admin-login-header">
                        <div className="admin-login-title">АВТОРИЗАЦИЯ</div>
                    </div>
                    <div className="admin-login-body">
                        <form onSubmit={handleSubmit}>
                            <div className="admin-login-field">
                                <label className="admin-login-label">E-mail</label>
                                <input
                                    type="email"
                                    className="admin-login-input"
                                    placeholder="example@domain.xyz"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="admin-login-field">
                                <label className="admin-login-label">Пароль</label>
                                <input
                                    type="password"
                                    className="admin-login-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="admin-login-error">{error}</div>}
                            <button type="submit" className="admin-login-btn" disabled={loading}>
                                {loading ? 'Вход...' : 'АВТОРИЗОВАТЬСЯ'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminLoginPage;