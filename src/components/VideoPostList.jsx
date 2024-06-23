import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import DeletePostButton from './DeletePostButton'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const VideoPostList = () => {
  const [videoPosts, setVideoPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVideoPosts = async () => {
      try {
        const videoPostsCollection = collection(db, 'videoPosts')
        const videoPostSnapshot = await getDocs(videoPostsCollection)
        const videoPostList = videoPostSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setVideoPosts(videoPostList)
      } catch (error) {
        console.error('Error fetching video posts: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideoPosts()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='container'>
      <h1>Video Posts</h1>
      <ul>
        {videoPosts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            {post.videoUrl && (
              <video controls>
                <source src={post.videoUrl} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            )}
            <DeletePostButton postId={post.id} />
            <button onClick={() => navigate(`/edit-video/${post.id}`)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VideoPostList
