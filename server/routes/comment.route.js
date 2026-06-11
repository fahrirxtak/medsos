import express from "express"
import { AuthMiddleware } from "../middleware/auth.middleware.js"
import { createComment, DeleteCommentById } from "../controllers/comment.controller.js"

const commentRouter = express.Router()

commentRouter.post('/', AuthMiddleware, createComment)
commentRouter.delete('/:id', AuthMiddleware, DeleteCommentById)

export default commentRouter
