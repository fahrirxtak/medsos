import prisma from "../utils/prisma.js"

export const createComment = async(req, res) => {
    try {
        const currentUserId = req.user.id

        const { postId, content} = req.body

        // validation 1
        if(!postId || !content) {
            res.status(400).json({
                message: "inputan post dan content wajib diisi"
            })
        }

        // validation 2
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!postData) {
            return res.status(404).json({
                message: "Post/feed tidak ditemukan"
            })
        }

        // insert data
        const newComment = await prisma.comment.create({
            data: {
                userId: Number(currentUserId),
                postId: Number(postId),
                content
            }
        })

        await prisma.post.update({
            where: { id: Number(postId) },
            data: { commentCount: { increment: 1 } }
        })

        res.status(201).json({
            message: "Comment berhasil",
            data: newComment
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server down",
            error
        })
    }
}

export const DeleteCommentById = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const { id } = req.params

        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) }
        })

        if (!comment) {
            return res.status(404).json({ message: "Comment tidak ditemukan" })
        }

        if (comment.userId !== currentUserId) {
            return res.status(403).json({ message: "Tidak diizinkan menghapus comment orang lain" })
        }

        await prisma.comment.delete({
            where: { id: Number(id) }
        })

        await prisma.post.update({
            where: { id: comment.postId },
            data: { commentCount: { decrement: 1 } }
        })

        res.status(200).json({ message: "Comment berhasil dihapus" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down", error })
    }
}