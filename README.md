<div align="center">

# QuickBlog

**A modern full-stack blog platform with an admin dashboard, AI-assisted writing, and cloud image hosting.**

Visitors read and comment on posts. The admin writes articles, generates drafts with Google Gemini, uploads optimized images through ImageKit, and moderates every comment.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white">
  <img alt="Node" src="https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>

[Live App](https://quick-blog-app-pink.vercel.app) &nbsp;•&nbsp; [Live API](https://quick-blog-server-ten.vercel.app) &nbsp;•&nbsp; [Source](https://github.com/SamirHossain2001/QuickBlogApp)

</div>

---

## ✨ Features

**Public site**

- Browse published posts, filter by category, and search by keyword.
- Read a full article with rich, formatted content.
- Leave comments that stay hidden until the admin approves them.

**Admin dashboard** (single account, protected by JWT)

- Secure login that issues a token valid for 7 days.
- Overview of blog, comment and draft counts alongside recent posts.
- A Quill rich-text editor for writing articles.
- One-click draft generation powered by Google Gemini (`gemini-3.6-flash`).
- Thumbnail uploads that are automatically optimized to WebP by ImageKit.
- Publish, unpublish and delete posts.
- Approve or remove reader comments.

## 🧩 Tech stack

| Layer    | Technologies                                                                                     |
| :------- | :----------------------------------------------------------------------------------------------- |
| Frontend | React 19, Vite 6, React Router 7, Tailwind CSS 4, Axios, Quill, marked, DOMPurify, Framer Motion |
| Backend  | Node.js, Express 5, MongoDB, Mongoose 8, JSON Web Tokens, Multer                                 |
| Services | Google Gemini (`@google/genai`), ImageKit                                                        |
| Hosting  | Vercel (client and server deployed as separate projects)                                         |

## 📁 Project structure

```text
QuickBlog/
├── client/     # React + Vite frontend  (see client/README.md)
├── server/     # Express + MongoDB API   (see server/README.md)
└── README.md   # this file
```

The frontend and backend are independent applications, each with its own `package.json`, `.env`, and Vercel project.

## 🚀 Quick start

### Prerequisites

- Node.js 18 or newer and npm
- A MongoDB database such as MongoDB Atlas
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- An [ImageKit](https://imagekit.io) account (public key, private key, URL endpoint)

### 1. Clone the repository

```bash
git clone https://github.com/SamirHossain2001/QuickBlogApp.git
cd QuickBlogApp
```

### 2. Start the backend

```bash
cd server
npm install
cp .env.example .env      # fill in the values
npm run server
```

### 3. Start the frontend

In a second terminal:

```bash
cd client
npm install
cp .env.example .env      # set VITE_BASE_URL
npm run dev
```

Open http://localhost:5173. The admin panel lives at `/admin` and signs in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in `server/.env`.

## 🔑 Environment variables

Every variable is documented inside the `.env.example` files. Copy each one to `.env` and fill it in.

| Scope  | File                                         | Key variables                                                                                                      |
| :----- | :------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| Server | [`server/.env.example`](server/.env.example) | `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`, `IMAGEKIT_*`, `CLIENT_URL`, `PORT` |
| Client | [`client/.env.example`](client/.env.example) | `VITE_BASE_URL`                                                                                                    |

> [!NOTE]
> `MONGODB_URI` must be the cluster URI **without** a database name. The server appends `/quickblog` automatically.

## 🔌 API overview

Routes are mounted under `/api/admin` and `/api/blog`. Admin routes require an `Authorization` header containing the login token.

| Method | Endpoint                     | Auth | Description                       |
| :----- | :--------------------------- | :--: | :-------------------------------- |
| POST   | `/api/admin/login`           |      | Log in and receive a JWT          |
| GET    | `/api/admin/dashboard`       |  ✅  | Counts plus recent blogs          |
| GET    | `/api/admin/blogs`           |  ✅  | All blogs, including drafts       |
| GET    | `/api/admin/comments`        |  ✅  | All comments                      |
| POST   | `/api/admin/approve-comment` |  ✅  | Approve a comment                 |
| POST   | `/api/admin/delete-comment`  |  ✅  | Delete a comment                  |
| GET    | `/api/blog/all`              |      | Published blogs                   |
| GET    | `/api/blog/:blogId`          |      | A single blog by id               |
| POST   | `/api/blog/add`              |  ✅  | Create a blog (multipart image)   |
| POST   | `/api/blog/toggle-publish`   |  ✅  | Publish or unpublish              |
| POST   | `/api/blog/delete`           |  ✅  | Delete a blog and its comments    |
| POST   | `/api/blog/add-comment`      |      | Add a comment (pending approval)  |
| POST   | `/api/blog/comments`         |      | Approved comments for a blog      |
| POST   | `/api/blog/generate`         |  ✅  | Generate blog content with Gemini |

Full request and response details live in [`server/README.md`](server/README.md).

## ☁️ Deployment

Both apps deploy to Vercel as separate projects.

- **Server:** root directory `server/`, configured by `server/vercel.json`. Add every variable from `server/.env.example` in the Vercel project settings, and set `CLIENT_URL` to your deployed client origin so CORS is locked down. Redeploy after changing environment variables.
- **Client:** root directory `client/`, configured by `client/vercel.json` for single-page routing. Set `VITE_BASE_URL` to your deployed server URL.

## 🔒 Security notes

- The app uses a single admin account defined by environment variables. Keep those credentials private.
- Real `.env` files are gitignored. Only the secret-free `.env.example` files are committed.

## 🙌 Credits

Built by **Samir Hossain** ([@SamirHossain2001](https://github.com/SamirHossain2001)).

This project was built by following [GreatStack's tutorial](https://youtu.be/yl9pwazDHUw?si=KQUw1BZH_uRBlexe), "How to Build a Full Stack AI Powered Blog App using MERN Stack, Google Gemini and ImageKit API." Many thanks to GreatStack for the clear, practical guidance.

## 📄 License

Released under the [MIT License](LICENSE).
