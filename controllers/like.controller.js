import prisma from "../utils/prisma.js"

export const LikeFeedUser = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const { postId } = req.params

        const postData = await prisma.post.findUnique({
            where: { id: Number(postId) }
        })

        if (!postData) {
            return res.status(404).json({ message: "Post/Feed tidak ditemukan" })
        }

        // Jika sudah di like 
        const CheckLike = await prisma.likes.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if (CheckLike) {
           await prisma.likes.delete({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
           })

           await prisma.post.update({
            where: {
                id: Number(postId)
            },
            data: {
                likeCount: { decrement: 1}
            }
           })
           
           return res.status(200).json({
            message: "Unlike post berhasil"
           })
        }

        // like
        await prisma.likes.create({
            data: {
                userId: currentUserId,
                postId: Number(postId)
            }
        })

        await prisma.post.update({
            where: { id: Number(postId) },
            data: { likeCount: { increment: 1 } }
        })

        res.status(201).json({ message: "Like berhasil", })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down", error })
    }
}

export const CheckLikeUser = async (req, res) => {
    const { postId } = req.params
    const currentUserId = req.user.id

    try {
        // validation
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!postData) {
            return res.status(404).json({
                message: "Post/Feed tidak ditemukan"
            })
        }
        const checkLike = await prisma.likes.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if (checkLike) {
            return res.status(200).json({
                data: true
            })
        }

        return res.status(200).json({
            data: false
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server down",
            error
        })
    }
}