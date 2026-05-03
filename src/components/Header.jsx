import {Link} from 'react-router-dom';

function Header({showAdminSubtitle = false, onLoginClick}) {
    return (
        <header className="header">
            <div className="container">
                <div className="logo-wrapper">
                    <Link to="/" className="logo">
                        <span className="logo-strong">ИДЁМ</span>
                        <span className="logo-thin">В</span>
                        <span className="logo-strong">КИНО</span>
                    </Link>
                    {showAdminSubtitle && <div className="admin-subtitle">АДМИНИСТРАТОРРРСКАЯ</div>}
                </div>
                <div className="header-buttons">
                    {onLoginClick && (
                        <button className="login-btn" onClick={onLoginClick}>
                            ВОЙТИ
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;