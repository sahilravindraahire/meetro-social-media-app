import express from "express"
import {uplaodPost, getAllPosts, like, comment, saved, deletePost} from "../controllers/post.controller.js"
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/upload", verifyAuth, upload.single("media"), uplaodPost)
router.get("/", verifyAuth, getAllPosts)
router.put("/like/:postId", verifyAuth, like)
router.post("/comment/:postId", verifyAuth, comment)
router.put("/save/:postId", verifyAuth, saved)
router.delete("/:postId", verifyAuth, deletePost)

export default router