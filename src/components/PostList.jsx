import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import DeletePostButton from './DeletePostButton'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const PostList = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts')
        const postSnapshot = await getDocs(postsCollection)
        const postList = postSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPosts(postList)
      } catch (error) {
        console.error('Error fetching posts: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='container'>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
            <DeletePostButton postId={post.id} />
            <button onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostList
