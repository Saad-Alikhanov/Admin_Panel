import React, { useState, useEffect } from 'react'
import { db, storage } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const EditVideoPostForm = ({ postId }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialVideoUrl, setInitialVideoUrl] = useState('')
  const [isDataLoaded, setIsDataLoaded] = useState(false) // New state

  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = await getDoc(doc(db, 'videoPosts', postId))
      if (postDoc.exists()) {
        const postData = postDoc.data()
        setTitle(postData.title)
        setDescription(postData.description)
        setInitialVideoUrl(postData.videoUrl)
        setIsDataLoaded(true) // Set to true after data is loaded
      } else {
        console.error('Post not found')
      }
    }

    fetchPost()
  }, [postId])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let videoUrl = initialVideoUrl
      if (video) {
        const storageRef = ref(storage, `videos/${video.name}`)
        const snapshot = await uploadBytes(storageRef, video)
        videoUrl = await getDownloadURL(snapshot.ref)
      }

      await updateDoc(doc(db, 'videoPosts', postId), {
        title,
        description,
        videoUrl,
      })

      alert('Video post updated successfully')
    } catch (error) {
      console.error('Error updating post: ', error)
      alert('Error updating post')
    } finally {
      setLoading(false)
    }
  }

  if (!isDataLoaded) return <div>Loading...</div> // Render loading state

  return (
    <form onSubmit={handleUpdate}>
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
        {initialVideoUrl && !video && (
          <div>
            <video controls>
              <source src={initialVideoUrl} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      <button type='submit' disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
    </form>
  )
}

export default EditVideoPostForm
