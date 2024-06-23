const express = require('express')
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
require('dotenv').config() // Load environment variables from a .env file if present

// Load the service account key JSON file from an environment variable
const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH
if (!serviceAccountPath) {
  console.error(
    'Error: SERVICE_ACCOUNT_KEY_PATH environment variable is not set.'
  )
  process.exit(1) // Exit the process
}
const serviceAccount = require(serviceAccountPath)

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const app = express()

// Middleware to parse JSON bodies
app.use(bodyParser.json())

// Route to set a user as admin
app.post('/setAdmin', async (req, res) => {
  const { uid } = req.body
  try {
    const userRef = db.collection('users').doc(uid)
    await userRef.set({ isAdmin: true }, { merge: true })
    res.status(200).send('User set as admin')
  } catch (error) {
    console.error('Error setting user as admin:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to add a new user
app.post('/addUser', async (req, res) => {
  const { uid, email, displayName, isAdmin } = req.body
  try {
    const userRef = db.collection('users').doc(uid)
    await userRef.set({ email, displayName, isAdmin })
    res.status(200).send('User added successfully')
  } catch (error) {
    console.error('Error adding user:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to create a post
app.post('/posts', async (req, res) => {
  const { title, content, imageUrl, createdAt } = req.body
  try {
    const postRef = db.collection('posts').doc()
    await postRef.set({ title, content, imageUrl, createdAt })
    res.status(200).send('Post created successfully')
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to read posts
app.get('/posts', async (req, res) => {
  try {
    const postsSnapshot = await db.collection('posts').get()
    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    res.status(200).json(posts)
  } catch (error) {
    console.error('Error reading posts:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to update a post
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params
  const { title, content, imageUrl } = req.body
  try {
    const postRef = db.collection('posts').doc(id)
    await postRef.update({ title, content, imageUrl })
    res.status(200).send('Post updated successfully')
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to delete a post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const postRef = db.collection('posts').doc(id)
    await postRef.delete()
    res.status(200).send('Post deleted successfully')
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).send('Internal Server Error')
  }
})

const PORT = process.env.PORT || 5173
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
