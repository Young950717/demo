const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// to allow frontend to send GET, POST, PUT request
app.use(
  cors({
    origin: `http://localhost:${process.env.SVELTE_PORT}`,
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type']
  })
)

app.use(bodyParser.json())

// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const userRoutes = require('./routes/user')
const groupRoutes = require('./routes/group')
const authRoutes = require('./routes/auth')

app.use('/api/user', userRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/auth', authRoutes)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500)
  res.json({
    message: '服务器错误',
    success: false,
    code: -1
  })
})
// Start the server
const port = process.env.SERVER_PORT || 3000
app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}`
  )
})
