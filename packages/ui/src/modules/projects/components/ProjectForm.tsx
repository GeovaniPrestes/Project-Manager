
import { useEffect, useState } from 'react'

interface ProjectFormProps {
    entityLabel?: 'projeto' | 'comissão'
    initialData?: {
        id: number
        name: string
        description: string | null
        category: string | null
        color: string
        weeklyGoal: number
    }
    onCancel: () => void
    onSubmit: (data: {
        name: string
        description: string
        category: string
        color: string
        weeklyGoal: number
    }) => void
}

function ProjectForm({
    entityLabel = 'projeto',
    initialData,
    onCancel,
    onSubmit
}: ProjectFormProps) {
    const [name, setName] = useState(initialData?.name ?? '')
    const [description, setDescription] = useState(initialData?.description ?? '')
    const [category, setCategory] = useState(initialData?.category ?? '')
    const [color, setColor] = useState(initialData?.color ?? '#6489ed')
    const [weeklyGoal, setWeeklyGoal] = useState(
        String(initialData?.weeklyGoal ?? 0)
    )

    useEffect(() => {
        setName(initialData?.name ?? '')
        setDescription(initialData?.description ?? '')
        setCategory(initialData?.category ?? '')
        setColor(initialData?.color ?? '#6489ed')
        setWeeklyGoal(String(initialData?.weeklyGoal ?? 0))
    }, [initialData])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!name.trim()) {
            return
        }

        onSubmit({
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            color,
            weeklyGoal: Math.max(0, Number(weeklyGoal) || 0)
        })
    }

    const isEditing = Boolean(initialData)
    const entityName = entityLabel === 'projeto' ? 'projeto' : 'comissão'

    return (
        <form className="project-form" onSubmit={handleSubmit}>
            <h2>
                {isEditing
                    ? `Editar ${entityName}`
                    : entityLabel === 'projeto'
                        ? 'Novo projeto'
                        : 'Nova comissão'}
            </h2>

            <div className="project-form-field">
                <label htmlFor="project-name">
                    Nome {entityLabel === 'projeto' ? 'do projeto' : 'da comissão'}
                </label>
                <input
                    id="project-name"
                    type="text"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Ex.: Desenvolvimento de jogo"
                    required
                    autoFocus
                />
            </div>

            <div className="project-form-field">
                <label htmlFor="project-description">Descrição</label>
                <textarea
                    id="project-description"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    placeholder={
                        entityLabel === 'projeto'
                            ? 'Ex.: Desenvolvimento de jogo'
                            : 'Ex.: Trabalho de design para cliente'
                    }
                    rows={3}
                />
            </div>

            <div className="project-form-field">
                <label htmlFor="project-category">Categoria</label>
                <input
                    id="project-category"
                    type="text"
                    value={category}
                    onChange={event => setCategory(event.target.value)}
                    placeholder="Ex.: Desenvolvimento"
                />
            </div>

            <div className="project-form-row">
                <div className="project-form-field">
                    <label htmlFor="project-weekly-goal">
                        Meta semanal (horas)
                    </label>
                    <input
                        id="project-weekly-goal"
                        type="number"
                        min="0"
                        step="0.5"
                        value={weeklyGoal}
                        onChange={event => setWeeklyGoal(event.target.value)}
                    />
                </div>

                <div className="project-form-field">
                    <label htmlFor="project-color">Cor</label>
                    <input
                        id="project-color"
                        type="color"
                        value={color}
                        onChange={event => setColor(event.target.value)}
                    />
                </div>
            </div>

            <div className="project-form-actions">
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>

                <button type="submit">
                    {isEditing ? 'Salvar alterações' : `Criar ${entityLabel}`}
                </button>
            </div>
        </form>
    )
}

export default ProjectForm
