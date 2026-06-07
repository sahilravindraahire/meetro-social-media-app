import express from "express"
import {getCurrentUser, suggestedUsers, editProfile, getProfile, follow, followingList, search, getAllNotification, markAsRead, searchUsers} from "../controllers/user.controller.js"
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/me", verifyAuth, getCurrentUser)
router.get("/suggested", verifyAuth, suggestedUsers)
router.put("/edit-profile", verifyAuth, upload.single("profileImage"), editProfile)
router.get("/profile/:userName", verifyAuth, getProfile)
router.put("/follow/:targetUserId", verifyAuth, follow)
router.get("/following", verifyAuth, followingList)
router.get("/notifications", verifyAuth, getAllNotification)
router.put("/notifications/read", verifyAuth, markAsRead)
router.get("/search", verifyAuth, searchUsers)

export default router