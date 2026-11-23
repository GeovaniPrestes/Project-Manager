import {
    LayoutDashboard,
    FolderKanban,
    CalendarDays,
    Clock3,
    BookOpen,
    ChartColumn,
    Settings,
    Search,
    Bell
} from 'lucide-react'

import './styles/layout.css'

interface AppLayoutProps {
    children: React.ReactNode
    currentPage: string
    onNavigate: (page: string) => void
}

const navigation = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Projetos', icon: FolderKanban },
    { label: 'Planejamento', icon: CalendarDays },
    { label: 'Sessões', icon: Clock3 },
    { label: 'Biblioteca', icon: BookOpen },
    { label: 'Relatórios', icon: ChartColumn }
]

function AppLayout({
    children,
    currentPage,
    onNavigate
}: AppLayoutProps) {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">P</div>
                    <span>Project Manager</span>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">WORKSPACE</span>

                    <nav className="sidebar-navigation">
                        {navigation.map(({ label, icon: Icon }) => (
                            <button
                                key={label}
                                type="button"
                                className={`nav-item ${currentPage === label ? 'active' : ''}`}
                                onClick={() => onNavigate(label)}
                            >
                                <Icon size={19} strokeWidth={1.8} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    <div className="nav-item">
                        <Settings size={19} strokeWidth={1.8} />
                        <span>Configurações</span>
                    </div>

                    <div className="profile">
                        <div className="profile-avatar">G</div>
                        <div className="profile-info">
                            <strong>Meu espaço</strong>
                            <span>Workspace pessoal</span>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="main-area">
                <header className="topbar">
                    <div className="breadcrumb">
                        <span>Workspace</span>
                        <span className="breadcrumb-separator">/</span>
                        <strong>{currentPage}</strong>
                    </div>

                    <div className="topbar-actions">
                        <div className="search-box">
                            <Search size={17} />
                            <span>Buscar...</span>
                            <kbd>Ctrl K</kbd>
                        </div>

                        <div className="notification-icon">
                            <Bell size={19} />
                        </div>
                    </div>
                </header>

                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AppLayout
