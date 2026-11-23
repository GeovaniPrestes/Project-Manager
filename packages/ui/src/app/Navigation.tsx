export const APP_PAGES = {
    DASHBOARD: 'Dashboard',
    PROJECTS: 'Projetos',
    COMMISSIONS: 'Comissões',
    TASKS: 'Tarefas',
    TIMER: 'Cronômetro',
    CALENDAR: 'Calendário',
    PRODUCTIVITY: 'Produtividade',
    BOOKS: 'Livros',
    NOTIFICATIONS: 'Notificações',
    SETTINGS: 'Configurações'
} as const

export type AppPage =
    typeof APP_PAGES[keyof typeof APP_PAGES]

export const PAGE_DESCRIPTIONS: Record<AppPage, string> = {
    Dashboard: 'Acompanhe seus projetos e atividades.',
    Projetos: 'Gerencie seus projetos pessoais.',
    Comissões: 'Gerencie seus trabalhos e comissões.',
    Tarefas: 'Organize suas tarefas e acompanhe seu progresso.',
    Cronômetro: 'Registre suas sessões de foco e descanso.',
    Calendário: 'Visualize sua agenda e seus compromissos.',
    Produtividade: 'Analise seu desempenho e suas horas trabalhadas.',
    Livros: 'Gerencie seus livros e integre o Obsidian.',
    Notificações: 'Consulte seus avisos e lembretes.',
    Configurações: 'Personalize o funcionamento do aplicativo.'
}