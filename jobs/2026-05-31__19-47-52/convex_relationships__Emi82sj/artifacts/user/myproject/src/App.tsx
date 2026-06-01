import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const users = useQuery(api.queries.getUsers) ?? [];
  const tags = useQuery(api.queries.getTags) ?? [];
  const posts = useQuery(api.queries.getPosts) ?? [];
  const postsWithTags = useQuery(api.queries.getPostsWithTags) ?? [];

  const createUser = useMutation(api.mutations.createUser);
  const createPost = useMutation(api.mutations.createPost);
  const createTag = useMutation(api.mutations.createTag);
  const addTagToPost = useMutation(api.mutations.addTagToPost);

  const [userName, setUserName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [tagName, setTagName] = useState("");

  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | "">("");
  const [selectedPostId, setSelectedPostId] = useState<Id<"posts"> | "">("");
  const [selectedTagId, setSelectedTagId] = useState<Id<"tags"> | "">("");

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0]._id);
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    if (!selectedPostId && posts.length > 0) {
      setSelectedPostId(posts[0]._id);
    }
  }, [posts, selectedPostId]);

  useEffect(() => {
    if (!selectedTagId && tags.length > 0) {
      setSelectedTagId(tags[0]._id);
    }
  }, [selectedTagId, tags]);

  const postItems = useMemo(() => {
    return postsWithTags.map((post) => {
      const authorName = post.author?.name ?? "Unknown";
      const tagNames = post.tags.map((tag) => tag.name).join(", ") || "None";

      return (
        <li key={post._id} data-testid="post-item" className="post-item">
          <div className="post-title">{post.title}</div>
          <div className="post-meta">
            <span>Author: {authorName}</span>
            <span>Tags: {tagNames}</span>
          </div>
          <p className="post-content">{post.content}</p>
        </li>
      );
    });
  }, [postsWithTags]);

  const handleCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) {
      return;
    }
    await createUser({ name: trimmed });
    setUserName("");
  };

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedUserId) {
      return;
    }
    const title = postTitle.trim();
    const content = postContent.trim();
    if (!title || !content) {
      return;
    }
    await createPost({ title, content, authorId: selectedUserId });
    setPostTitle("");
    setPostContent("");
  };

  const handleCreateTag = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = tagName.trim();
    if (!trimmed) {
      return;
    }
    await createTag({ name: trimmed });
    setTagName("");
  };

  const handleAssignTag = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPostId || !selectedTagId) {
      return;
    }
    await addTagToPost({ postId: selectedPostId, tagId: selectedTagId });
  };

  return (
    <div className="app">
      <header>
        <h1>Convex Relationships</h1>
        <p>Manage users, posts, and tags with 1:N and N:M relations.</p>
      </header>

      <div className="grid">
        <section className="card">
          <h2>Create User</h2>
          <form onSubmit={handleCreateUser} className="stack">
            <input
              data-testid="create-user-input"
              type="text"
              placeholder="User name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
            <button data-testid="submit-user-btn" type="submit">
              Add User
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Create Post</h2>
          <form onSubmit={handleCreatePost} className="stack">
            <input
              data-testid="create-post-title-input"
              type="text"
              placeholder="Post title"
              value={postTitle}
              onChange={(event) => setPostTitle(event.target.value)}
            />
            <textarea
              data-testid="create-post-content-input"
              placeholder="Post content"
              value={postContent}
              onChange={(event) => setPostContent(event.target.value)}
            />
            <label className="label">
              Author
              <select
                data-testid="create-post-user-select"
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(event.target.value as Id<"users">)
                }
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <button data-testid="submit-post-btn" type="submit">
              Add Post
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Create Tag</h2>
          <form onSubmit={handleCreateTag} className="stack">
            <input
              data-testid="create-tag-input"
              type="text"
              placeholder="Tag name"
              value={tagName}
              onChange={(event) => setTagName(event.target.value)}
            />
            <button data-testid="submit-tag-btn" type="submit">
              Add Tag
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Assign Tag to Post</h2>
          <form onSubmit={handleAssignTag} className="stack">
            <label className="label">
              Post
              <select
                data-testid="assign-tag-post-select"
                value={selectedPostId}
                onChange={(event) =>
                  setSelectedPostId(event.target.value as Id<"posts">)
                }
              >
                {posts.map((post) => (
                  <option key={post._id} value={post._id}>
                    {post.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Tag
              <select
                data-testid="assign-tag-tag-select"
                value={selectedTagId}
                onChange={(event) =>
                  setSelectedTagId(event.target.value as Id<"tags">)
                }
              >
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <button data-testid="assign-tag-btn" type="submit">
              Assign Tag
            </button>
          </form>
        </section>
      </div>

      <section className="card">
        <h2>Posts</h2>
        <ul className="post-list">{postItems}</ul>
      </section>
    </div>
  );
}

export default App;
