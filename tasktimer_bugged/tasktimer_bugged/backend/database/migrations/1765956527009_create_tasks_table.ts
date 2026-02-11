import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      //
      // Clé primaire
      table.increments('id')

      // Titre unique et non nul
      table.string('title').notNullable().unique()

      // Description
      table.string('description').notNullable().defaultTo('')

      // Priorité par défaut à medium
      table.enum('priority', ['low', 'medium', 'high']).notNullable().defaultTo('medium')

      // Deadline de la tâche
      table.timestamp('due_date', { useTz: true }).nullable()

      // Date de création de la tâche
      table.timestamp('created_at')

      // Date de dernière modification de la tâche
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
