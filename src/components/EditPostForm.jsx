import React, { useState, useEffect } from 'react'
import { db, storage } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const EditPostForm = ({ postId }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialImageUrl, setInitialImageUrl] = useState('')
  const [isDataLoaded, setIsDataLoaded] = useState(false) // New state

  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const postData = postDoc.data()
        setTitle(postData.title)
        setContent(postData.content)
        setInitialImageUrl(postData.imageUrl)
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
      let imageUrl = initialImageUrl
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`)
        const snapshot = await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      await updateDoc(doc(db, 'posts', postId), {
        title,
        content,
        imageUrl,
      })

      alert('Post updated successfully')
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
        {initialImageUrl && !image && (
          <div>
            <img src={initialImageUrl} alt={title} style={{ width: '100px' }} />
          </div>
        )}
      </div>
      <button type='submit' disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
    </form>
  )
}

export default EditPostForm
