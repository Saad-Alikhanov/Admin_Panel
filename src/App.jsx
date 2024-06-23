import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from 'react-router-dom'
import TextPostForm from './components/TextPostForm'
import PostList from './components/PostList'
import EditPostForm from './components/EditPostForm'
import VideoPostForm from './components/VideoPostForm'
import VideoPostList from './components/VideoPostList'
import EditVideoPostForm from './components/EditVideoPostForm'
import { useParams } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <div>
        <h1>My Blog</h1>
        <nav>
          <Link to='/news'>News</Link> | <Link to='/media'>Media</Link>
        </nav>
        <Routes>
          <Route path='/' element={<Navigate to='/news' />} />
          <Route path='/news' element={<NewsSection />} />
          <Route path='/media' element={<MediaSection />} />
          <Route path='/edit/:postId' element={<EditPostWrapper />} />
          <Route
            path='/edit-video/:postId'
            element={<EditVideoPostWrapper />}
          />
        </Routes>
      </div>
    </Router>
  )
}

const NewsSection = () => (
  <div>
    <h2>Create Text Post</h2>
    <TextPostForm />
    <h2>Text Posts</h2>
    <PostList />
  </div>
)

const MediaSection = () => (
  <div>
    <h2>Create Video Post</h2>
    <VideoPostForm />
    <h2>Video Posts</h2>
    <VideoPostList />
  </div>
)

const EditPostWrapper = () => {
  const { postId } = useParams()
  return <EditPostForm postId={postId} />
}

const EditVideoPostWrapper = () => {
  const { postId } = useParams()
  return <EditVideoPostForm postId={postId} />
}

export default App
