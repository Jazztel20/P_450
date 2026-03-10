import { test } from '@japa/runner'

test.group('Tasks store', () => {
  test('création d une tache avec succès', async ({ client }) => {
    const response = await client.post('/api/tasks').json({
      title: 'Ma tâche de test',
      priority: 'medium'
    })
    response.assertStatus(201)
    response.assertBodyContains({ title: 'Ma tâche de test' })
  })
})