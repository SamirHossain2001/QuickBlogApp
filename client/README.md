<div align="center">

# QuickBlog Client

**The React and Vite frontend for [QuickBlog](../README.md).**

It serves the public blog site and the admin dashboard, talking to the [server API](../server/README.md) over HTTP.

</div>

---

## 🧩 Tech stack

- **Framework:** React 19 with Vite 6
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4
- **HTTP:** Axios, with the base URL taken from `VITE_BASE_URL`
- **Rich text:** Quill for the admin editor, plus `marked` and DOMPurify
- **Experience:** Framer Motion, react-hot-toast, SweetAlert2, moment

## 🚀 Getting started

```bash
npm install
cp .env.example .env      # set VITE_BASE_URL to your server URL
npm run dev               # http://localhost:5173
```

Make sure the [server](../server/README.md) is running, by default on `http://localhost:3000`, and that `VITE_BASE_URL` points to it.

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## 🔑 Environment variables

Vite only exposes variables prefixed with `VITE_`. Copy [`.env.example`](.env.example) to `.env`.

| Variable | Required | Description |
| :--- | :---: | :--- |
| `VITE_BASE_URL` | ✅ | Base URL of the backend API, for example `http://localhost:3000` |

## 📁 Routes and structure

Public routes render the blog site, while `/admin` renders the dashboard, gated by the login token stored in `localStorage`.

```text
client/src/
├── pages/
│   ├── Home.jsx           # blog list and search
│   ├── Blog.jsx           # single post and comments
│   └── admin/             # Layout, Dashboard, AddBlog, ListBlog, Comments
├── components/
│   ├── admin/             # Login, Sidebar, table items
│   └── BlogCard.jsx, BlogList.jsx, Header.jsx, Navbar.jsx, Footer.jsx
├── context/
│   └── AppContext.jsx     # axios instance, auth token, shared blog state
├── App.jsx
└── main.jsx
```

Shared state and the configured Axios instance live in `context/AppContext.jsx`. The admin token is attached to the `Authorization` header and persisted in `localStorage`.

## ☁️ Deployment

Deploy `client/` as its own Vercel project. The rewrite rule in [`vercel.json`](vercel.json) routes every path to `index.html` for single-page navigation. Set `VITE_BASE_URL` to your deployed server URL in the project settings.
