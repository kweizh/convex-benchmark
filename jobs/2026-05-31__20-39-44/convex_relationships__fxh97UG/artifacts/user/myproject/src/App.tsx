import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [userName, setUserName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [tagName, setTagName] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");

  const usersWithPosts = useQuery(api.posts.getUsersWithPosts);
  const postsWithTags = useQuery(api.posts.getPostsWithTags);
  const allTags = useQuery(api.posts.getAllTags);

  const createUser = useMutation(api.posts.createUser);
  const createPost = useMutation(api.posts.createPost);
  const createTag = useMutation(api.posts.createTag);
  const addTagToPost = useMutation(api.posts.addTagToPost);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    await createUser({ name: userName.trim() });
    setUserName("");
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !selectedAuthorId) return;
    await createPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      author_id: selectedAuthorId as any,
    });
    setPostTitle("");
    setPostContent("");
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    await createTag({ name: tagName.trim() });
    setTagName("");
  };

  const handleAddTagToPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !selectedTagId) return;
    await addTagToPost({
      post_id: selectedPostId as any,
      tag_id: selectedTagId as any,
    });
    setSelectedPostId("");
    setSelectedTagId("");
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>Convex 1:N & N:M Relationships</h1>

      {/* Create User */}
      <section style={{ marginBottom: 30 }}>
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            data-testid="create-user-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="User name"
          />
          <button data-testid="submit-user-btn" type="submit">
            Create User
          </button>
        </form>
      </section>

      {/* Create Post */}
      <section style={{ marginBottom: 30 }}>
        <h2>Create Post</h2>
        <form onSubmit={handleCreatePost}>
          <div>
            <label>Author: </label>
            <select
              data-testid="post-author-select"
              value={selectedAuthorId}
              onChange={(e) => setSelectedAuthorId(e.target.value)}
            >
              <option value="">-- Select Author --</option>
              {usersWithPosts?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              data-testid="create-post-title-input"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>
          <div>
            <input
              data-testid="create-post-content-input"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Post content"
            />
          </div>
          <button data-testid="submit-post-btn" type="submit">
            Create Post
          </button>
        </form>
      </section>

      {/* Create Tag */}
      <section style={{ marginBottom: 30 }}>
        <h2>Create Tag</h2>
        <form onSubmit={handleCreateTag}>
          <input
            data-testid="create-tag-input"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Tag name"
          />
          <button data-testid="submit-tag-btn" type="submit">
            Create Tag
          </button>
        </form>
      </section>

      {/* Assign Tag to Post */}
      <section style={{ marginBottom: 30 }}>
        <h2>Assign Tag to Post</h2>
        <form onSubmit={handleAddTagToPost}>
          <div>
            <label>Post: </label>
            <select
              data-testid="assign-post-select"
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
            >
              <option value="">-- Select Post --</option>
              {postsWithTags?.map((post) => (
                <option key={post._id} value={post._id}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tag: </label>
            <select
              data-testid="assign-tag-select"
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
            >
              <option value="">-- Select Tag --</option>
              {allTags?.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <button data-testid="submit-assign-tag-btn" type="submit">
            Assign Tag
          </button>
        </form>
      </section>

      {/* Posts List */}
      <section>
        <h2>Posts</h2>
        {postsWithTags === undefined ? (
          <p>Loading posts...</p>
        ) : postsWithTags.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {postsWithTags.map((post) => (
              <li
                key={post._id}
                data-testid="post-item"
                style={{
                  padding: 10,
                  marginBottom: 10,
                  border: "1px solid #ccc",
                  borderRadius: 5,
                }}
              >
                <strong data-testid="post-title">{post.title}</strong>
                <p>{post.content}</p>
                <span data-testid="post-author">
                  Author: {post.authorName}
                </span>
                <br />
                <span data-testid="post-tags">
                  Tags:{" "}
                  {post.tags.length > 0
                    ? post.tags.map((t: any) => t.name).join(", ")
                    : "None"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;