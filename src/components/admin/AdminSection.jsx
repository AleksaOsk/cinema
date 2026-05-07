function AdminSection({
                          id,
                          title,
                          isOpen,
                          onToggle,
                          showLineUp = false,
                          showLineDown = false,
                          showBodyLine = true,
                          children
                      }) {
    return (
        <div className="admin-section">
            <div className="admin-section-header" onClick={() => onToggle(id)}>
                <div className="admin-section-icon">
                    <div className="admin-circle"></div>
                    {showLineUp && <div className="admin-header-line-up"></div>}
                    {showLineDown && <div className="admin-header-line-down"></div>}
                </div>
                <h2 className="admin-section-title">{title}</h2>
                <button className="admin-section-arrow">
                    {isOpen
                        ? <img src="./images/arrow.svg" alt="Закрыть"/>
                        : <img src="./images/arrow.svg" alt="Открыть" style={{transform: 'rotate(270deg)'}}/>
                    }
                </button>
            </div>

            {isOpen && (
                <div className="admin-section-body">
                    {showBodyLine && <div className="admin-body-line"></div>}
                    <div className="admin-section-content">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSection;