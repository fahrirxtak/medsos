# 📱 Media Sosial — Fullstack App

Aplikasi media sosial fullstack berbasis **React + Vite** (frontend) dan **Node.js + Express + Prisma** (backend), dengan database PostgreSQL di Neon.tech dan penyimpanan gambar di Cloudinary.

---

## 🗂 Struktur Project

```
medsos/
├── client/          # Frontend — React + Vite + TailwindCSS + DaisyUI
└── server/          # Backend  — Node.js + Express + Prisma
```

---

## ✨ Fitur

- 🔐 **Autentikasi** — Register & Login dengan JWT
- 👤 **Profil User** — Lihat, edit profil, dan update foto profil
- 🔍 **Pencarian** — Cari user berdasarkan username
- 📝 **Feed / Post** — Buat postingan dengan gambar & caption
- ❤️ **Like** — Like/unlike postingan
- 💬 **Komentar** — Tambah & hapus komentar pada postingan
- 🔖 **Bookmark** — Simpan/hapus postingan favorit
- 👥 **Follow** — Follow & unfollow user, serta saran pengguna untuk di-follow

---

## 🛠 Tech Stack

### Backend (`/server`)
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Node.js | ≥ v18 | Runtime JavaScript |
| Express | ^5.2 | Web framework |
| Prisma | ^6.19 | ORM & database migrations |
| PostgreSQL | — | Database (via Neon.tech) |
| JSON Web Token | ^9.0 | Autentikasi |
| Bcrypt | ^6.0 | Hash password |
| Cloudinary | ^2.10 | Penyimpanan gambar |
| Multer | ^2.1 | Upload file |
| Zod | ^4.4 | Validasi input |
| CORS | ^2.8 | Cross-origin requests |

### Frontend (`/client`)
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | ^19.2 | UI library |
| Vite | ^8.0 | Build tool & dev server |
| React Router DOM | ^7.17 | Client-side routing |
| TailwindCSS | ^4.3 | Utility-first CSS |
| DaisyUI | ^5.5 | Component library |
| Zustand | ^5.0 | State management |
| Axios | ^1.17 | HTTP client |
| React Icons | ^5.6 | Icon library |

---

## 📋 Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org) v18 atau lebih baru
- [Git](https://git-scm.com)
- Akun [Neon.tech](https://neon.tech) (database PostgreSQL gratis)
- Akun [Cloudinary](https://cloudinary.com) (storage gambar gratis)

---

## 🚀 Setup Step by Step

### 1. Clone Repository

```bash
git clone <url-repo>
cd medsos
```

---

### 2. Setup Backend (`/server`)

#### Install Dependencies

```bash
cd server
npm install
```

#### Setup Database — Neon.tech

1. Daftar/login di [neon.tech](https://neon.tech)
2. Klik **New Project**, beri nama project
3. Buka tab **Connection Details**
4. Copy **Connection string** seperti:
   ```
   postgresql://user:password@host/dbname?sslmode=require
   ```

#### Setup Storage — Cloudinary

1. Daftar/login di [cloudinary.com](https://cloudinary.com)
2. Masuk ke **Dashboard**
3. Catat nilai berikut:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### Buat File `.env`

Buat file `.env` di dalam folder `server/`, lalu isi:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWTSECRET=isi_dengan_random_string_panjang
CLOUDNAME=cloud_name_kamu
CLOUDKEY=api_key_kamu
CLOUDPASSWORD=api_secret_kamu
```

> 💡 Untuk `JWTSECRET`, gunakan string random yang panjang, contoh: `myjwtsecretkey123`

#### Jalankan Migration Database

```bash
npx prisma migrate dev
```

#### (Opsional) Seed Database

```bash
npx prisma db seed
```

#### Jalankan Server

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`

---

### 3. Setup Frontend (`/client`)

Buka terminal baru dari root project:

```bash
cd client
npm install
```

#### Buat File `.env`

Buat file `.env` di dalam folder `client/`, lalu isi:

```env
VITE_API_URL=http://localhost:3000
```

#### Jalankan Dev Server

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173`

---

## 🗃 Skema Database

```
User
 ├── Post[]
 ├── Comment[]
 ├── Likes[]
 ├── BookMark[]
 ├── followings → Follow[]
 └── followers  → Follow[]

Post
 ├── Comment[]
 ├── Likes[]
 └── BookMark[]

Follow  (followerId ↔ followingId)
Comment (userId ↔ postId)
Likes   (userId ↔ postId)
BookMark (userId ↔ postId)
```

---

## 🌐 Halaman Frontend

| Route | Halaman | Keterangan |
|-------|---------|------------|
| `/` | Home | Feed utama postingan |
| `/login` | Login | Halaman login |
| `/register` | Register | Halaman registrasi |
| `/search` | Search | Cari user |
| `/create` | Create Feed | Buat postingan baru |
| `/setting` | Settings | Edit profil & foto |
| `/:username` | User Profile | Detail profil user |

---

## 📡 Endpoint API

> Base URL: `http://localhost:3000/api`
>
> *(auth)* = butuh Bearer Token di header `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/auth/register` | Register user baru |
| POST | `/auth/login` | Login user |

### User
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/user/search?username=` | Cari user berdasarkan username |
| GET | `/user/:username` | Detail profil user |
| PUT | `/user/update-user` | Update profil *(auth)* |
| PUT | `/user/update-photo-profile` | Update foto profil *(auth)* |

### Feed
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/feed` | Buat post baru *(auth)* |
| GET | `/feed` | Ambil semua feed *(auth)* |

### Follow
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/follow` | Follow user *(auth)* |
| DELETE | `/follow/:unfollowUserId` | Unfollow user *(auth)* |
| GET | `/follow/suggestions` | Saran user untuk di-follow *(auth)* |

### Comment
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/comment` | Buat komentar *(auth)* |
| DELETE | `/comment/:id` | Hapus komentar *(auth)* |

### Like
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/like/:postId` | Like / unlike post *(auth)* |

### Bookmark
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/bookmark/:postid` | Save / unsave post *(auth)* |
| GET | `/bookmark/:postid` | Cek status bookmark *(auth)* |

---

## 💡 Contoh Request & Response

### Register

**Request** `POST /api/auth/register`

```json
{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@gmail.com",
  "password": "password123"
}
```

**Response**

```json
{
  "message": "Register berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login

**Request** `POST /api/auth/login`

```json
{
  "email": "john@gmail.com",
  "password": "password123"
}
```

**Response**

```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Gunakan Token

Untuk endpoint yang membutuhkan autentikasi, tambahkan header:

```
Authorization: Bearer <token>
```

---

## 📂 Struktur Folder Detail

```
server/
├── controllers/         # Logic handler setiap fitur
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── feed.controller.js
│   ├── follow.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   └── bookmark.controller.js
├── middleware/          # Middleware autentikasi & upload
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── routes/              # Definisi route API
│   ├── auth.route.js
│   ├── user.route.js
│   ├── feed.route.js
│   ├── follow.route.js
│   ├── comment.route.js
│   ├── likes.route.js
│   └── bookmark.route.js
├── prisma/
│   ├── schema.prisma    # Skema database
│   └── seed.js          # Data awal database
├── utils/               # Helper functions
├── server.js            # Entry point server
└── .env                 # Environment variables (tidak di-commit)

client/
├── src/
│   ├── Views/           # Halaman utama
│   │   ├── HomeView.jsx
│   │   ├── LoginView.jsx
│   │   ├── RegisterView.jsx
│   │   ├── SearchView.jsx
│   │   ├── CreateFeedView.jsx
│   │   ├── UpdateUserView.jsx
│   │   └── DetailUserView.jsx
│   ├── components/      # Komponen reusable
│   │   ├── BtnLike.jsx
│   │   ├── BtnSave.jsx
│   │   ├── ButtonFollow.jsx
│   │   ├── DetailFeed.jsx
│   │   └── ListUser.jsx
│   ├── layouts/         # Layout halaman
│   ├── stores/          # State management (Zustand)
│   │   └── authStore.js
│   ├── config/          # Konfigurasi axios & utilitas
│   │   ├── axios.js
│   │   └── date.js
│   ├── App.jsx          # Root component & routing
│   └── main.jsx         # Entry point React
└── .env                 # Environment variables (tidak di-commit)
```

---

## ⚡ Scripts

### Backend

| Script | Perintah | Keterangan |
|--------|----------|------------|
| Dev server | `npm run dev` | Jalankan server dengan auto-reload |
| Migration | `npx prisma migrate dev` | Jalankan migrasi database |
| Seed | `npx prisma db seed` | Isi database dengan data awal |
| Prisma Studio | `npx prisma studio` | GUI untuk melihat database |

### Frontend

| Script | Perintah | Keterangan |
|--------|----------|------------|
| Dev server | `npm run dev` | Jalankan frontend dev server |
| Build | `npm run build` | Build untuk production |
| Preview | `npm run preview` | Preview hasil build |
| Lint | `npm run lint` | Cek kualitas kode |

---

## 🔒 Keamanan

- Password di-hash menggunakan **bcrypt** sebelum disimpan ke database
- Autentikasi menggunakan **JWT** (JSON Web Token)
- File upload divalidasi menggunakan **Multer**
- Input request divalidasi menggunakan **Zod**
- Gambar disimpan di **Cloudinary** (bukan di server lokal)

---

## 📝 Catatan

- File `.env` **tidak boleh** di-commit ke Git — sudah ditambahkan ke `.gitignore`
- Pastikan server backend berjalan sebelum menjalankan frontend
- Untuk production, ubah `VITE_API_URL` di client ke URL server yang sudah di-deploy
