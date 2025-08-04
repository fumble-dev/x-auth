import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/mongodb.js'
import { authRouter } from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Home Route')
})

app.use('/api/auth',authRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    connectDB()
})
