import { Express, json } from 'express'
import { Server } from 'http'
import * as swaggerUi from 'swagger-ui-express'
import errorHandlingMiddleware from '../interfaces/middlewares/errorHandlingMiddleware'
import routes from '../interfaces/routes'
import * as swaggerDocument from '../swagger.json'

export default async function (app: Express) {
  app.use(json())
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  app.use((req, res, next) => {
    app.use(json())
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    )

    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With, Content-type, Authorization, Cache-control, Pragma',
    )

    next()
  })

  routes(app)
  app.use(errorHandlingMiddleware)
  return new Promise<Server>((resolve, reject) => {
    const PORT = process.env.PORT || 3000
    const connection = app
      .listen(PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
}
