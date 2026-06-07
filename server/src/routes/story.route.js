import express from "express"
import {uploadStory, viewStory, getStoryByUserName, getAllStories, deleteStory} from "../controllers/story.controller.js"
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/upload", verifyAuth, upload.single("media"), uploadStory)
router.get("/", verifyAuth, getAllStories)
router.get("/user/:userName", verifyAuth, getStoryByUserName)
router.get("/view/:storyId", verifyAuth, viewStory)

export default router