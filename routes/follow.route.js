import express from 'express'
import { followUserCount, getLimitUser, isFollowUser, unfollowUserAccount } from '../controllers/follow.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'

const followRouter = express.Router()

followRouter.post('/', AuthMiddleware, followUserCount)
followRouter.delete('/:unfollowUserId', AuthMiddleware,unfollowUserAccount )
followRouter.get('/user', AuthMiddleware, getLimitUser)
followRouter.get('/:followerUserId', AuthMiddleware, isFollowUser)


export default followRouter