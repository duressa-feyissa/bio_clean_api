import * as Joi from 'joi'

const userRoles: string[] = ['ADMIN', 'MASTER', 'USER']

export default function validateUser(user: any) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(30),
    lastName: Joi.string().trim().min(3).max(30),
    phone: Joi.string().trim().min(3).max(30),

    password: Joi.string().trim().min(6).max(30),
    role: Joi.string()
      .trim()
      .valid(...userRoles),

    image: Joi.string().trim(),
  })
  return schema.validate(user)
}
