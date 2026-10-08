const BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function request(path, opt = {}) {
  const token = localStorage.getItem("blog-token");
  const response = await fetch(BASE + path, {
    ...opt,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opt.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  register: (d) => request("/auth/register", { method: "POST", body: JSON.stringify(d) }),
  login: (d) => request("/auth/login", { method: "POST", body: JSON.stringify(d) }),
  me: () => request("/auth/me"),
  posts: (p) => {
    const query = new URLSearchParams();
    if (p?.search) query.set("search", p.search);
    if (p?.category && p.category !== "All") query.set("category", p.category);
    return request(`/posts?${query.toString()}`);
  },
  post: (id) => request(`/posts/${id}`),
  createPost: (d) => request("/posts", { method: "POST", body: JSON.stringify(d) }),
  updatePost: (id, d) => request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deletePost: (id) => request(`/posts/${id}`, { method: "DELETE" }),
  addComment: (id, text) => request(`/posts/${id}/comments`, { method: "POST", body: JSON.stringify({ text }) }),
  deleteComment: (id) => request(`/comments/${id}`, { method: "DELETE" })
};