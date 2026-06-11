import { response } from "express"
import prisma from "../utils/prisma.js"
import cloudinary from "../utils/cloudinary.js"
import { tr } from "zod/v4/locales"

export const CreateFeed = async (req, res) => {
    try {
        const { caption } = req.body
        const currentUserId = req.user.id

        // validation
        if (!caption) {
            return res.status(400).json({ message: 'caption wajib diisi' })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'file gambar belum diisi' })
        }

        // upload gambar dengan buffer multer
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`

        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'feed',
            transformation: [
                { aspect_ratio: "4:5", crop: "fill", gravity: "auto" },
                { quality: "auto", fetch_format: "auto" }
            ]
        })

        //  buat postingann feed baru
        const newFeed = await prisma.post.create({
            data: {
                caption,
                image: result.secure_url,
                imageId: result.public_id,
                userId: currentUserId
            }
        })

        // update data user
        await prisma.user.update({
            where: { id: Number(currentUserId) },
            data: { postCount: { increment: 1 } }
        })

        // response
        res.status(201).json({
            message: "Feed berhasil dibuat",
            data: newFeed
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}

export const ReadAllFeeds = async (req, res) => {
    try {
        const currentUserId = req.user.id

        const followings = await prisma.follow.findMany({
            where: { followingId: currentUserId },
            select: { followerId: true }
        })

        const followingIds = followings.map(f => f.followerId)

        // Query Request
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.page) || 3
        const skip = (page - 1) * limit

        const totalFeed = await prisma.post.count({
            where: {
                userId: { in: [...followingIds, currentUserId] }
            }
        })

        const posts = await prisma.post.findMany(
            {
                where: {
                    userId: { in: [...followingIds, currentUserId] }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createAt: "desc"
                },
                skip: skip,
                take: limit

            },
        )

        const totalPages = Math.ceil(totalFeed / limit)

        res.status(200).json({
            page,
            limit,
            totalPages,
            totalFeed,
            data: posts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}

export const detailFeed = async (req, res) => {
    const { id } = req.params

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        username: true,
                        image: true
                    }
                },
                comments: {
                    select: {
                        content: true,
                        createAt: true,
                        user: {
                            select: {
                                id: true,
                                fullname: true,
                                username: true,
                                image: true,
                                createAt: true
                            }
                        }
                    },
                    orderBy: { createAt: "desc" }
                }
            }
        })

        if (!post) {
            return res.status(404).json({
                message: "post tidak ditemukan"
            })
        }

        res.status(200).json({
            message: "get detail feed",
            data: post
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}

export const deleteFeed = async (req, res) => {
    const { id } = req.params

    try {
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!postData) {
            return res.status(404).json({
                message: "Feeds Tidak ditemukan"
            })
        }

        if (postData.userId != req.user.id) {
            return res.status(400).json({
                message: "Anda tidak bisa mengahapus feed user lain"
            })
        }

        if (postData.imageId) {
            await cloudinary.uploader.destroy(postData.imageId)
        }

        await prisma.post.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json({
            message: "Data Feeds berhasil di hapus"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}