import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

function App() {
  const [userName, setUserName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<Id<"users"> | "">("");
  const [tagName, setTagName] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<Id<"posts"> | "">("");
  const [selectedTagId, setSelectedTagId] = useState<Id<"tags"> | "">("");

  const users = useQuery(api.users.list);
  const posts = useQuery(api.posts.list);
  const tags = useQuery(api.tags.list);

  const createUser = useMutation(api.users.create);
  const createPost = useMutation(api.posts.create);
  const createTag = useMutation(api.tags.create);
  const linkTag = useMutation(api.tags.linkToPost);

  const handleCreateUser = async () => {
    if (userName) {
      await createUser({ name: userName });
      setUserName("");
    }
  };

  const handleCreatePost = async () => {
    if (postTitle && postContent && selectedAuthorId) {
      await createPost({
        title: postTitle,
        content: postContent,
        author_id: selectedAuthorId as Id<"users">,
      });
      setPostTitle("");
      setPostContent("");
    }
  };

  const handleCreateTag = async () => {
    if (tagName) {
      await createTag({ name: tagName });
      setTagName("");
    }
  };

  const handleLinkTag = async () => {
    if (selectedPostId && selectedTagId) {
      await linkTag({
        post_id: selectedPostId as Id<"posts">,
        tag_id: selectedTagId as Id<"tags">,
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Convex Relationships</h1>

      <section>
        <h2>Create User</h2>
        <input
          data-testid="create-user-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User Name"
        />
        <button data-testid="submit-user-btn" onClick={handleCreateUser}>
          Create User
        </button>
      </section>

      <section>
        <h2>Create Post</h2>
        <input
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Post Title"
        />
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Post Content"
        />
        <select
          value={selectedAuthorId}
          onChange={(e) => setSelectedAuthorId(e.target.value as Id<"users">)}
        >
          <option value="">Select Author</option>
          {users?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreatePost}>Create Post</button>
      </section>

      <section>
        <h2>Create Tag</h2>
        <input
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag Name"
        />
        <button onClick={handleCreateTag}>Create Tag</button>
      </section>

      <section>
        <h2>Assign Tag to Post</h2>
        <select
          value={selectedPostId}
          onChange={(e) => setSelectedPostId(e.target.value as Id<"posts">)}
        >
          <option value="">Select Post</option>
          {posts?.map((post) => (
            <option key={post._id} value={post._id}>
              {post.title}
            </option>
          ))}
        </select>
        <select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value as Id<"tags">)}
        >
          <option value="">Select Tag</option>
          {tags?.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
        <button onClick={handleLinkTag}>Assign Tag</button>
      </section>

      <section>
        <h2>Posts</h2>
        <div data-testid="posts-list">
          {posts?.map((post) => (
            <div
              key={post._id}
              data-testid="post-item"
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>
                <strong>Author:</strong> {post.authorName}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {post.tags.map((t) => t.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
