# Media Sosial - Backend API

REST API untuk aplikasi media sosial berbasis Node.js, Express, dan Prisma.

## Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org) v18 atau lebih baru
- [Git](https://git-scm.com)
- Akun [Neon.tech](https://neon.tech) (database PostgreSQL gratis)
- Akun [Cloudinary](https://cloudinary.com) (storage gambar gratis)

---

## Setup Step by Step

### 1. Clone Repository

```bash
git clone <url-repo>
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database - Neon.tech

1. Daftar/login di [neon.tech](https://neon.tech)
2. Klik **New Project**, beri nama project
3. Setelah project dibuat, buka tab **Connection Details**
4. Copy **Connection string** yang formatnya seperti ini:
   ```
   postgresql://user:password@host/dbname?sslmode=require
   ```

### 4. Setup Storage - Cloudinary

1. Daftar/login di [cloudinary.com](https://cloudinary.com)
2. Masuk ke **Dashboard**
3. Catat nilai berikut:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 5. Buat File .env

Buat file `.env` di root project, lalu isi:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWTSECRET=isi_dengan_random_string_panjang
CLOUDNAME=cloud_name_kamu
CLOUDKEY=api_key_kamu
CLOUDPASSWORD=api_secret_kamu
```

> Untuk `JWTSECRET` bisa pakai string random apapun, contoh: `myjwtsecretkey123`

### 6. Jalankan Migration Database

```bash
npx prisma migrate dev
```

### 7. Jalankan Server

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`

---

## Endpoint API

### Auth
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/auth/register | Register user baru |
| POST | /api/auth/login | Login user |

### User
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/user/search?username= | Cari user |
| GET | /api/user/:username | Detail user |
| PUT | /api/user/update-user | Update profil *(auth)* |
| PUT | /api/user/update-photo-profile | Update foto profil *(auth)* |

### Feed
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/feed | Buat post baru *(auth)* |

### Follow
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/follow | Follow user *(auth)* |
| DELETE | /api/follow/:unfollowUserId | Unfollow user *(auth)* |
| GET | /api/follow/suggestions | Saran user untuk di-follow *(auth)* |

### Comment
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/comment | Buat komentar *(auth)* |
| DELETE | /api/comment/:id | Hapus komentar *(auth)* |

### Like
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/like/:postId | Like post *(auth)* |

### Bookmark
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/bookmark/:postid | Save/unsave post *(auth)* |
| GET | /api/bookmark/:postid | Cek status bookmark *(auth)* |

> *(auth)* = butuh Bearer token di header `Authorization`

---

## Contoh Request Register

```json
{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@gmail.com",
  "password": "password123"
}
```

Response akan mengembalikan `token` yang digunakan untuk request selanjutnya.
