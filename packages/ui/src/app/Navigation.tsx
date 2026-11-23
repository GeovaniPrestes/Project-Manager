export const APP_PAGES = {
    DASHBOARD: 'Dashboard',
    PROJECTS: 'Projetos',
    PLANNING: 'Planejamento',
    SESSIONS: 'Sessões',
    LIBRARY: 'Biblioteca',
    REPORTS: 'Relatórios'
} as const

export type AppPage =
    typeof APP_PAGES[keyof typeof APP_PAGES]

export const PAGE_DESCRIPTIONS: Record<AppPage, string> = {
    Dashboard: 'Acompanhe seus projetos e atividades.',
    Projetos: 'Gerencie e acompanhe seus projetos.',
    Planejamento: 'Organize suas metas e atividades.',
    Sessões: 'Acompanhe seu tempo de trabalho.',
    Biblioteca: 'Organize seus materiais e referências.',
    Relatórios: 'Analise seu desempenho e progresso.'
}