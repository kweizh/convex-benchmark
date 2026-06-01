import { useState } from 'react'
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

function App() {
  const users = useQuery(api.db.getUsers) || [];
  const tags = useQuery(api.db.getTags) || [];
  const posts = useQuery(api.db.getPostsWithTags) || [];

  const createUser = useMutation(api.db.createUser);
  const createPost = useMutation(api.db.createPost);
  const createTag = useMutation(api.db.createTag);
  const assignTag = useMutation(api.db.assignTag);

  const [userName, setUserName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const [tagName, setTagName] = useState('');
  
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) return;
    await createUser({ name: userName });
    setUserName('');
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent || !selectedUserId) return;
    await createPost({ 
      title: postTitle, 
      content: postContent, 
      author_id: selectedUserId as Id<"users"> 
    });
    setPostTitle('');
    setPostContent('');
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName) return;
    await createTag({ name: tagName });
    setTagName('');
  };

  const handleAssignTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !selectedTagId) return;
    await assignTag({ 
      post_id: selectedPostId as Id<"posts">, 
      tag_id: selectedTagId as Id<"tags"> 
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Convex 1:N and N:M Relationships</h1>
      
      <section>
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser}>
          <input 
            data-testid="create-user-input"
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="User Name" 
          />
          <button type="submit" data-testid="submit-user-btn">Create User</button>
        </form>
      </section>

      <section>
        <h2>Create Post</h2>
        <form onSubmit={handleCreatePost}>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select Author</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
          <input 
            value={postTitle} 
            onChange={(e) => setPostTitle(e.target.value)} 
            placeholder="Post Title" 
          />
          <input 
            value={postContent} 
            onChange={(e) => setPostContent(e.target.value)} 
            placeholder="Post Content" 
          />
          <button type="submit">Create Post</button>
        </form>
      </section>

      <section>
        <h2>Create Tag</h2>
        <form onSubmit={handleCreateTag}>
          <input 
            value={tagName} 
            onChange={(e) => setTagName(e.target.value)} 
            placeholder="Tag Name" 
          />
          <button type="submit">Create Tag</button>
        </form>
      </section>

      <section>
        <h2>Assign Tag to Post</h2>
        <form onSubmit={handleAssignTag}>
          <select 
            value={selectedPostId} 
            onChange={(e) => setSelectedPostId(e.target.value)}
          >
            <option value="">Select Post</option>
            {posts.map(post => (
              <option key={post._id} value={post._id}>{post.title}</option>
            ))}
          </select>
          <select 
            value={selectedTagId} 
            onChange={(e) => setSelectedTagId(e.target.value)}
          >
            <option value="">Select Tag</option>
            {tags.map(tag => (
              <option key={tag._id} value={tag._id}>{tag.name}</option>
            ))}
          </select>
          <button type="submit">Assign Tag</button>
        </form>
      </section>

      <section>
        <h2>Posts List</h2>
        <ul>
          {posts.map(post => (
            <li key={post._id} data-testid="post-item">
              <strong>{post.title}</strong> by {post.author?.name}
              <p>{post.content}</p>
              <div>
                Tags: {post.tags.map(tag => tag?.name).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
