import express from "express"
import {sendMessage, getMessage, deleteMessage, getConversation, markAsRead, editMessage} from "../controllers/message.controller.js"
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/send/:receiverId", verifyAuth, upload.single("image"), sendMessage)
router.get("/conversation/all", verifyAuth, getConversation)
router.get("/:conversationPartnerId", verifyAuth, getMessage)
router.put("/read/:senderId", verifyAuth, markAsRead)
router.put("/edit/:messageId", verifyAuth, editMessage)
router.delete("/:messageId", verifyAuth, deleteMessage)

export default router