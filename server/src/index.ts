import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import curationRouter from './routes/curation'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/curate', curationRouter)

app.listen(PORT, () => {
  console.log(`맛ZIP 서버 실행 중: http://localhost:${PORT}`)
})
