<div align="center">

# QuickBlog Server

**The backend API that powers [QuickBlog](../README.md).**

An Express and MongoDB service handling blog content, comment moderation, admin authentication, AI draft generation, and image uploads.

</div>

---

## 🧩 Tech stack

- **Runtime:** Node.js with ES modules, Express 5
- **Database:** MongoDB through Mongoose 8
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Uploads:** Multer to ImageKit, delivered as optimized WebP
- **AI:** `@google/genai` using Gemini `gemini-3.6-flash`
- **Utilities:** cors, dotenv

## 🚀 Getting started

```bash
npm install
cp .env.example .env      # fill in the values
npm run server            # auto-reloads on http://localhost:3000
```

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run server` | Start with `nodemon` for local development |
| `npm start` | Start with `node server.js` for production |

## 🔑 Environment variables

Copy [`.env.example`](.env.example) to `.env`, then set each value.

| Variable | Required | Description |
| :--- | :---: | :--- |
| `MONGODB_URI` | ✅ | MongoDB cluster URI without a database name (the app appends `/quickblog`) |
| `JWT_SECRET` | ✅ | Secret used to sign admin tokens |
| `ADMIN_EMAIL` | ✅ | The single admin login email |
| `ADMIN_PASSWORD` | ✅ | The admin login password |
| `GEMINI_API_KEY` | ✅ | Google Gemini key for AI generation |
| `IMAGEKIT_PUBLIC_KEY` | ✅ | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ✅ | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ✅ | ImageKit URL endpoint |
| `CLIENT_URL` | | Allowed CORS origins, comma separated. Empty allows all, for development only |
| `PORT` | | Local development port (defaults to `3000`) |

## 📁 Project layout

```text
server/
├── configs/
│   ├── db.js           # Mongoose connection
│   ├── gemini.js       # Gemini client and blog-writer prompt
│   └── imageKit.js     # ImageKit client
├── controllers/
│   ├── adminController.js   # login, dashboard, comment moderation
│   └── blogController.js    # blog CRUD, comments, AI generation
├── middleware/
│   ├── auth.js         # verifies the admin token
│   └── multer.js       # multipart image handling
├── models/
│   ├── Blog.js
│   └── Comment.js
├── routes/
│   ├── adminRoutes.js  # /api/admin/*
│   └── blogRoutes.js   # /api/blog/*
├── server.js           # app entry: CORS, JSON parsing, routes
└── vercel.json         # Vercel build configuration
```

## 🔐 Authentication

`POST /api/admin/login` checks the request against `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then returns a token that expires in 7 days. Protected routes expect that token in the `Authorization` header, either as a raw value or as `Bearer <token>`, and the token email must match `ADMIN_EMAIL`.

## 🔌 API reference

Every response is JSON shaped like `{ success: boolean, ... }`.

### Admin, `/api/admin`

| Method | Path | Auth | Body or params | Returns |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/login` | | `{ email, password }` | `{ success, token }` |
| GET | `/dashboard` | ✅ | | `{ success, dashboardData }` |
| GET | `/blogs` | ✅ | | `{ success, blogs }` including drafts |
| GET | `/comments` | ✅ | | `{ success, comments }` |
| POST | `/approve-comment` | ✅ | `{ id }` | `{ success, message }` |
| POST | `/delete-comment` | ✅ | `{ id }` | `{ success, message }` |

### Blog, `/api/blog`

| Method | Path | Auth | Body or params | Returns |
| :--- | :--- | :---: | :--- | :--- |
| GET | `/all` | | | `{ success, blogs }` published |
| GET | `/:blogId` | | url param | `{ success, blog }` |
| POST | `/add` | ✅ | multipart: `blog` JSON string, `image` file | `{ success, message }` |
| POST | `/toggle-publish` | ✅ | `{ id }` | `{ success, message }` |
| POST | `/delete` | ✅ | `{ id }` | `{ success, message }` |
| POST | `/add-comment` | | `{ blog, name, content }` | `{ success, message }` |
| POST | `/comments` | | `{ blogId }` | `{ success, comments }` approved |
| POST | `/generate` | ✅ | `{ prompt }` | `{ success, content }` |

> [!NOTE]
> For `POST /add`, the `blog` field is a JSON string of `{ title, subTitle, description, category, isPublished }`, where `description` is the Quill HTML. The image is uploaded to ImageKit and stored as an optimized WebP URL.

## 🗃️ Data models

**Blog:** `title`, `subTitle`, `description` (HTML), `category`, `image` (URL), `isPublished`, timestamps.

**Comment:** `blog` (reference), `name`, `content`, `isApproved` (defaults to `false`), timestamps. New comments stay hidden until an admin approves them.

## ☁️ Deployment

Deploy `server/` as its own Vercel project, configured by [`vercel.json`](vercel.json). Add every variable from `.env.example` in the project settings, set `CLIENT_URL` to your deployed client origin, and redeploy after any environment change.
