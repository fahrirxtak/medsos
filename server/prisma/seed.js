import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const users = [
    { fullname: "Fahkri Ramadhan", username: "fahkri123", email: "fahkri@gmail.com" },
    { fullname: "Budi Santoso", username: "budisant", email: "budi@gmail.com" },
    { fullname: "Siti Nurhaliza", username: "sitinur", email: "siti@gmail.com" },
    { fullname: "Andi Wijaya", username: "andiwijaya", email: "andi@gmail.com" },
    { fullname: "Dewi Kusuma", username: "dewikusuma", email: "dewi@gmail.com" },
    { fullname: "Rizky Pratama", username: "rizkyprat", email: "rizky@gmail.com" },
    { fullname: "Mega Putri", username: "megaputri", email: "mega@gmail.com" },
    { fullname: "Hendra Gunawan", username: "hendragun", email: "hendra@gmail.com" },
    { fullname: "Laila Fitri", username: "lailafitri", email: "laila@gmail.com" },
    { fullname: "Yoga Prasetyo", username: "yogapras", email: "yoga@gmail.com" },
]

const posts = [
    { caption: "Hari yang menyenangkan bersama teman-teman!", image: "https://picsum.photos/seed/post1/1080/1080", imageId: "seed/post1" },
    { caption: "Sunset yang indah sore ini 🌅", image: "https://picsum.photos/seed/post2/1080/1080", imageId: "seed/post2" },
    { caption: "Makan siang enak hari ini 🍜", image: "https://picsum.photos/seed/post3/1080/1080", imageId: "seed/post3" },
    { caption: "Jalan-jalan ke pantai, segar banget!", image: "https://picsum.photos/seed/post4/1080/1080", imageId: "seed/post4" },
    { caption: "Produktif hari ini, semangat terus!", image: "https://picsum.photos/seed/post5/1080/1080", imageId: "seed/post5" },
]

async function main() {
    console.log("Seeding data...")

    // hapus data lama
    await prisma.bookMark.deleteMany()
    await prisma.likes.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.follow.deleteMany()
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync("password123", salt)

    // buat users
    const createdUsers = []
    for (const user of users) {
        const created = await prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
                bio: `Halo, saya ${user.fullname}!`
            }
        })
        createdUsers.push(created)
        console.log(`Created user: ${created.username}`)
    }

    // buat posts (tiap user 1 post dari list)
    const createdPosts = []
    for (let i = 0; i < createdUsers.length; i++) {
        const post = posts[i % posts.length]
        const created = await prisma.post.create({
            data: {
                ...post,
                userId: createdUsers[i].id,
                caption: `${post.caption} - by ${createdUsers[i].username}`
            }
        })
        createdPosts.push(created)

        // update postCount user
        await prisma.user.update({
            where: { id: createdUsers[i].id },
            data: { postCount: { increment: 1 } }
        })
    }

    // buat follow (user pertama follow semua, user lain follow user pertama)
    for (let i = 1; i < createdUsers.length; i++) {
        await prisma.follow.create({
            data: {
                followerId: createdUsers[0].id,
                followingId: createdUsers[i].id
            }
        })
        await prisma.follow.create({
            data: {
                followerId: createdUsers[i].id,
                followingId: createdUsers[0].id
            }
        })
    }

    // update follow count user pertama
    await prisma.user.update({
        where: { id: createdUsers[0].id },
        data: {
            followingCount: createdUsers.length - 1,
            followerCount: createdUsers.length - 1
        }
    })

    // buat beberapa comment dan like
    for (let i = 1; i < 4; i++) {
        await prisma.comment.create({
            data: {
                userId: createdUsers[i].id,
                postId: createdPosts[0].id,
                content: `Keren banget postingannya! 🔥`
            }
        })
        await prisma.likes.create({
            data: {
                userId: createdUsers[i].id,
                postId: createdPosts[0].id
            }
        })
    }

    await prisma.post.update({
        where: { id: createdPosts[0].id },
        data: { commentCount: 3, likeCount: 3 }
    })

    console.log("Seeding selesai!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
