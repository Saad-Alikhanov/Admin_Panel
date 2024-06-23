import React, { useState } from 'react'
import TextPostForm from './TextPostForm'
import VideoPostForm from './VideoPostForm'
import PostList from './PostList'
import VideoPostList from './VideoPostList'
import '../css/admin.css'

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState('news')

  return (
    <div className='admin-container'>
      <div className='admin-tabs'>
        <button onClick={() => setSelectedTab('news')}>News</button>
        <button onClick={() => setSelectedTab('media')}>Media</button>
      </div>
      <div className='admin-content'>
        {selectedTab === 'news' && (
          <div>
            <h2>Create Text Post</h2>
            <TextPostForm />
            <h2>Edit/Delete Text Posts</h2>
            <PostList />
          </div>
        )}
        {selectedTab === 'media' && (
          <div>
            <h2>Create Video Post</h2>
            <VideoPostForm />
            <h2>Edit/Delete Video Posts</h2>
            <VideoPostList />
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
