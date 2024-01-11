import * as Joi from 'joi'

export default function validateInputs(inputs: any) {
  const schema = Joi.object({
    type: Joi.string().trim().min(2).max(256),
    waste: Joi.number().min(0).max(10000),
    water: Joi.number().min(0).max(10000),
    methanol: Joi.number().min(0).max(10000),
  })
  return schema.validate(inputs)
}
