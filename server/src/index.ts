import express from 'express'
import cors from 'cors'
import curationRouter from './routes/curation'
import geocodeRouter from './routes/geocode'
import restaurantsRouter from './routes/restaurants'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/curate', curationRouter)
app.use('/api/geocode', geocodeRouter)
app.use('/api/restaurants', restaurantsRouter)

app.listen(PORT, () => {
  console.log(`맛ZIP 서버 실행 중: http://localhost:${PORT}`)
})
