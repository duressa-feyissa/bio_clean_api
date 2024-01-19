import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { resolve } from 'path'
import { cwd } from 'process'

dotenv.config({ path: resolve(cwd(), '.env') })

export default cleanEnv(process.env, {
  JWT: str(),
  MONGO: str(),
  PORT: num({ default: 1337 }),
  OPENAI_API_KEY: str(),
})
