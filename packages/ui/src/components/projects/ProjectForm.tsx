import { useState } from 'react'

interface ProjectFormProps {
    onCancel: () => void
    onSubmit: (data: {
        name: string
        description: string
        category: string
        color: string
        weeklyGoal: number
    }) => void
}

function ProjectForm({ onCancel, onSubmit }: ProjectFormProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [color, setColor] = useState('#6489ed')
    const [weeklyGoal, setWeeklyGoal] = useState('0')

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

    return (
        <form className="project-form" onSubmit={handleSubmit}>
            <div className="project-form-field">
                <label htmlFor="project-name">Nome do projeto</label>
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
                    placeholder="Descreva seu projeto..."
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
                    <label htmlFor="project-color">Cor do projeto</label>
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
                    Criar projeto
                </button>
            </div>
        </form>
    )
}

export default ProjectForm
