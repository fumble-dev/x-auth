import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import mongoose from "mongoose";


const app = express()
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:['https://x-auth-client.vercel.app', 'http://localhost:5173'],
  credentials: true
}))


app.get('/', (req, res) => {
    res.send('Home Route')
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})



mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
