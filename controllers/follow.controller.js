import prisma from "../utils/prisma.js"

export const followUserCount = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const { followUserId } = req.body

        if (!followUserId) {
            return res.status(400).json({ message: "followUserId wajib diisi" })
        }

        if (currentUserId === Number(followUserId)) {
            return res.status(400).json({ message: "Tidak bisa follow akun sendiri" })
        }

        const otherUser = await prisma.user.findUnique({
            where: { id: Number(followUserId) }
        })

        if (!otherUser) {
            return res.status(404).json({ message: "User tidak ditemukan" })
        }

        const isFollowUser = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: Number(currentUserId),
                    followingId: Number(followUserId)
                }
            }
        })

        if (isFollowUser) {
            return res.status(400).json({ message: "User sudah pernah di follow" })
        }

        const follow = await prisma.follow.create({
            data: {
                followerId: currentUserId,
                followingId: Number(followUserId)
            }
        })

        // update followingCount milik current user
        await prisma.user.update({
            where: { id: currentUserId },
            data: { followingCount: { increment: 1 } }
        })

        // update followerCount milik user yang di-follow
        await prisma.user.update({
            where: { id: Number(followUserId) },
            data: { followerCount: { increment: 1 } }
        })

        res.status(201).json({
            message: "Follow user berhasil",
            data: follow
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down" })
    }
}

export const unfollowUserAccount = async (req, res) => {
    try {
        const { unfollowUserId } = req.params
        const currentUserId = req.user.id

        const userUnfollow = await prisma.user.findUnique({
            where: { id: Number(unfollowUserId) }
        })

        if (!userUnfollow) {
            return res.status(404).json({ message: "User tidak ditemukan" })
        }

        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: Number(currentUserId),
                    followingId: Number(unfollowUserId)
                }
            }
        })

        if (!isFollowing) {
            return res.status(400).json({ message: "Kamu belum follow user ini" })
        }

        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: Number(currentUserId),
                    followingId: Number(unfollowUserId)
                }
            }
        })

        // kurangi followingCount currentUser
        await prisma.user.update({
            where: { id: currentUserId },
            data: { followingCount: { decrement: 1 } }
        })

        // kurangi followerCount user yang di-unfollow
        await prisma.user.update({
            where: { id: Number(unfollowUserId) },
            data: { followerCount: { decrement: 1 } }
        })

        res.status(200).json({ message: "User berhasil di unfollow" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down" })
    }
}

export const getLimitUser = async (req, res) => {
    try {
        const currentUserId = req.user.id

        const followedUser = await prisma.follow.findMany({
            where: { followerId: currentUserId },
            select: { followingId: true }
        })

        const followedIds = followedUser.map(f => f.followingId)

        const users = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [...followedIds, currentUserId]
                }
            },
            select: {
                id: true,
                image: true,
                fullname: true,
                username: true,
            },
            take: 5,
            orderBy: {
                createAt: 'desc'
            }
        })

        res.status(200).json({
            message: "5 user yang belum di follow",
            data: users
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}

export const isFollowUser = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const { followerUserId } = req.params

        const checkFollowUserId = await prisma.user.findUnique({
            where: {
                id: Number(followerUserId)
            }
        })

        if (!checkFollowUserId) {
            return res.status(404).json({
                message: "user Tidak di temukan"
            })
        }
        const isFollowUserData = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: Number(followerUserId),
                    followingId: currentUserId
                }
            }
        })

        if (isFollowUserData) {
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
            message: "Server Down",
            error
        })
    }
}