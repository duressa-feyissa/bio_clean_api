import * as Joi from 'joi'

export default function validateMachine(machine: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50),
    serialNumber: Joi.string().trim().min(2).max(50),
    location: Joi.string().trim().min(2).max(50),
  })
  return schema.validate(machine)
}
