import React, { useState } from 'react'
import { db } from '../firebase'
import { doc, deleteDoc } from 'firebase/firestore'

const DeletePostButton = ({ postId }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      await deleteDoc(doc(db, 'posts', postId))
      alert('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post: ', error)
      alert('Error deleting post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export default DeletePostButton
