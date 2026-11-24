import ChecklistItem from '../database/ChecklistItem.js'

interface CreateChecklistItemData {
    taskId: number
    title: string
}

class ChecklistService {
    async getAll(taskId: number) {
        return ChecklistItem.findAll({
            where: { taskId },
            order: [['createdAt', 'ASC']],
            raw: true
        })
    }

    async create(data: CreateChecklistItemData) {
        const item = await ChecklistItem.create({
            taskId: data.taskId,
            title: data.title.trim()
        })

        return item.toJSON()
    }

    async update(id: number, title: string) {
        const item = await ChecklistItem.findByPk(id)

        if (!item) {
            throw new Error('Checklist item not found.')
        }

        item.title = title.trim()
        await item.save()

        return item.toJSON()
    }

    async toggle(id: number) {
        const item = await ChecklistItem.findByPk(id)

        if (!item) {
            throw new Error('Checklist item not found.')
        }

        item.completed = !item.completed
        await item.save()

        return item.toJSON()
    }

    async delete(id: number) {
        const item = await ChecklistItem.findByPk(id)

        if (!item) {
            throw new Error('Checklist item not found.')
        }

        await item.destroy()

        return { success: true }
    }
}

export default new ChecklistService()
