import Task from '#models/task'
import { taskValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  /**
   * Obtenir la liste des tâches
   */
  async index({ response }: HttpContext) {
    // Récupérer toutes les tâches triées par deadline
    const tasks = await Task.query().orderBy('created_at', 'desc')

    // On utilise `response.ok` pour retourner un code HTTP 200
    // et les tâches (json)
    return response.ok(tasks)
  }

  /**
   * Créer une nouvelle tâche
   */
  async store({ request, response }: HttpContext) {
    // Récupération des données envoyées par le client et validation des données
    const { title, description, priority, dueDate } = await request.validateUsing(taskValidator)

    // Création d'une nouvelle tâche avec les données validées
    try {
      const task = await Task.create({ title, description, priority, dueDate })
      return response.created(task)
    } catch (error) {
      // Gestion propre des erreurs DB (ex: title unique)
      if (String(error?.code) === 'ER_DUP_ENTRY') {
        return response.conflict({ message: 'Une tâche avec ce titre existe déjà.' })
      }
      throw error
    }
  }

  /**
   * Obtenir une tâche
   */
  async show({ params, response }: HttpContext) {
    // Récupère la tâche dont l'id vaut 'params.id'
    const task = await Task.query().where('id', params.id)

    return response.ok(task)
  }

  /**
   * Mettre à jour une tâche
   */
  async update({ params, request, response }: HttpContext) {
    // Récupération des données envoyées par le client et validation des données
    const { title, description, priority, dueDate } = await request.validateUsing(taskValidator)

    // Vérification de l'existence de la tâche
    const task = await Task.query().where('id', params.id).firstOrFail()

    // Mise à jour des données de la tâche
    task.merge({ title, description, priority, dueDate })

    // Sauvegarde des modifications
    try {
      await task.save()
      return response.ok(task)
    } catch (error) {
      if (String(error?.code) === 'ER_DUP_ENTRY') {
        return response.conflict({ message: 'Une tâche avec ce titre existe déjà.' })
      }
      throw error
    }
  }

  /**
   * Supprimer une tâche
   */
  async destroy({ params, response }: HttpContext) {
    // Vérification de l'existence de la tâche
    const task = await Task.findOrFail(params.id)

    // Suppression de la tâche
    await task.delete()

    // On utilise `response.noContent` pour retourner un code HTTP 204 sans contenu
    return response.noContent()
  }
}
