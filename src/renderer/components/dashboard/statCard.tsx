import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    description: string
    icon: LucideIcon
}

function StatCard({
    title,
    value,
    description,
    icon: Icon
}: StatCardProps) {
    return (
        <article className="stat-card">
            <div className="stat-card-header">
                <span className="stat-card-title">{title}</span>

                <div className="stat-card-icon">
                    <Icon size={19} strokeWidth={1.8} />
                </div>
            </div>

            <strong className="stat-card-value">{value}</strong>

            <span className="stat-card-description">
                {description}
            </span>
        </article>
    )
}

export default StatCard
