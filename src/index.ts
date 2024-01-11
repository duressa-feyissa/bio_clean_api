import express from 'express'
import runMongo from './config/mongo'
import runApp from './config/runApp'

void (async () => {
  console.log('Starting mongo')
  const app = express()
  await runMongo()
  console.log('Mongo connected')
  await runApp(app)
})()
