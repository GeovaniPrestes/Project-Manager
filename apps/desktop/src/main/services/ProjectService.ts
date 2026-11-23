import Project from '../database/models/Project.js'

export async function getProjects() {
    const projects = await Project.findAll({
        order: [['createdAt', 'ASC']]
    })

    return projects.map(project => project.toJSON())
}
