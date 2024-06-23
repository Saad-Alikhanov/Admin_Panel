import React, { useState, useEffect } from 'react'
import { db, storage, auth } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const TextPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((error) => {
          console.error('Error signing in anonymously:', error)
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ''
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`)
        const snapshot = await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      await addDoc(collection(db, 'posts'), {
        title,
        content,
        imageUrl,
        createdAt: Timestamp.fromDate(new Date()),
      })

      setTitle('')
      setContent('')
      setImage(null)
      alert('Post created successfully')
    } catch (error) {
      console.error('Error creating post: ', error)
      alert('Error creating post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Image:</label>
        <input type='file' onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <button type='submit' disabled={loading}>
        {loading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  )
}

export default TextPostForm
