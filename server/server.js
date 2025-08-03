import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/mongodb.js'

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


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    connectDB()
})
