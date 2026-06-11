import express from 'express'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
import { CheckSavedFeed, toggleSavedFeed } from '../controllers/bookmark.controller.js'

const BookmarkRouter = express.Router()

BookmarkRouter.post('/:postid', AuthMiddleware, toggleSavedFeed)
BookmarkRouter.get('/:postid', AuthMiddleware, CheckSavedFeed)

export default BookmarkRouter