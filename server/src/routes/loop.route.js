import express from "express"
import {uploadLoop, like, comment, getAllLoops, deleteLoop} from "../controllers/loop.controller.js"
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/upload", verifyAuth, upload.single("media"), uploadLoop)
router.get("/", verifyAuth, getAllLoops)
router.put("/like/:loopId", verifyAuth, like)
router.post("/comment/:loopId", verifyAuth, comment)
router.delete("/:loopId", verifyAuth, deleteLoop)

export default router