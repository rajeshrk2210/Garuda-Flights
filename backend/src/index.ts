import express, { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import authRoutes from './routes/authRoutes'
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();

const app = express()

// Middleware to parse JSON
app.use(cors())
app.use(express.json())

// Load swagger.json file
const swaggerDocument = JSON.parse(
  fs.readFileSync('./src/docs/swagger.json', 'utf-8')
)

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Routes
app.use('/auth', authRoutes)

app.use('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Garuda Flights' })
})

export default app
