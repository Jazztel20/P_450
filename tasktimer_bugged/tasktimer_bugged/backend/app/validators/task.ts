import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const taskValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(0).maxLength(255),
    description: vine.string().trim().maxLength(1000).optional(),
    priority: vine.enum(['low', 'medium', 'high'] as const).optional(),
    dueDate: vine
      .date()
      .transform((date) => DateTime.fromJSDate(date))
      .optional(),
  })
)
