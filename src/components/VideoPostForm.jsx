import React, { useState, useEffect } from 'react'
import { db, storage, auth } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const VideoPostForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)

  // Handle anonymous sign-in for simplicity
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
      let videoUrl = ''
      if (video) {
        const storageRef = ref(storage, `videos/${video.name}`)
        const snapshot = await uploadBytes(storageRef, video)
        videoUrl = await getDownloadURL(snapshot.ref)
      }

      await addDoc(collection(db, 'videoPosts'), {
        title,
        description,
        videoUrl,
        createdAt: Timestamp.fromDate(new Date()),
      })

      setTitle('')
      setDescription('')
      setVideo(null)
      alert('Video post created successfully')
    } catch (error) {
      console.error('Error creating video post: ', error)
      alert('Error creating video post')
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
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Video:</label>
        <input
          type='file'
          accept='video/*'
          onChange={(e) => setVideo(e.target.files[0])}
        />
      </div>
      <button type='submit' disabled={loading}>
        {loading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  )
}

export default VideoPostForm
