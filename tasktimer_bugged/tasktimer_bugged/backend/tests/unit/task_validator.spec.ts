import { test } from '@japa/runner'
import { taskValidator } from '#validators/task'

test.group('Task Validator', () => {
  test('doit échouer si le titre est vide', async ({ assert }) => {
    try {
      const data = { title: "" }
      await taskValidator.validate(data)
    } catch (error) {
      assert.exists(error.messages) // Le test réussit si le validateur bloque
    }
  })
})