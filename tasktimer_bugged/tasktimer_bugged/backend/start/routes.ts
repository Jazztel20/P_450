/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import TasksController from '#controllers/tasks_controller'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    // Routes pour le CRUD /api/tasks
    router.resource('tasks', TasksController).apiOnly()
  })
  .prefix('api/')
