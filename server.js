const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5173

app.use(cors())
app.use(bodyParser.json())

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/authDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const User = mongoose.model('User', UserSchema)

// Register Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ email, password: hashedPassword })
    await newUser.save()
    res.status(201).send('User registered')
  } catch (err) {
    res.status(500).send('Error registering user')
  }
})

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).send('Invalid credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).send('Invalid credentials')
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    })

    res.status(200).json({ token })
  } catch (err) {
    res.status(500).send('Error logging in')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
