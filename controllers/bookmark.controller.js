import prisma from "../utils/prisma.js"

export const toggleSavedFeed = async (req, res) => {
    const { postid } = req.params
    const currentUserId = req.user.id

    try {
        // validation
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postid)
            }
        })
        if (!postData) {
            return res.status(404).json({
                message: "Post/Feed tidak ditemukan"
            })
        }
        const checkUserBookmark = await prisma.bookMark.findUnique({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId: Number(postid)
                }
            }
        })

        if (checkUserBookmark) {
            // delete booknark
            await prisma.bookMark.delete({
                where: {
                    userId_postId: {
                        userId: req.user.id,
                        postId: Number(postid)
                    }
                }
            })

            return res.status(200).json({
                message: "Berhasil unsave Post/Feed"
            })
        }

        // create bookmark
        const newBookmark = await prisma.bookMark.create({
            data: {
                userId: req.user.id,
                postId: Number(postid)
            }
        })

        return res.status(200).json({
            message: "Berhasil save Post/Feed",
            data: newBookmark
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down", error })
    }
}

export const CheckSavedFeed = async (req, res) => {
    try {
        const {postid} = req.params
        const currentUserId = req.user.id

        const checkSaved = await prisma.bookMark.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postid)
                }
            }
        })

        if(checkSaved) {
            return res.status(200).json({data: true})
        }
          return res.status(200).json({data: false})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down", error })
    }
}