import {Story} from "../models/Story.model.js"
import {User} from "../models/User.model.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"


export const uploadStory = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(!user){
        throw new apiError(400, "error while getting user")
    }

    if(user.story){
        const oldStory = await Story.findById(user.story)

        if(oldStory?.mediaPublicId){
            const resourceType = oldStory.mediaType === "video" ? "video" : "image"
            await deleteFromCloudinary(oldStory.mediaPublicId, resourceType)
        }

        await Story.findByIdAndDelete(oldStory._id)
        user.story = null
    }

    const {mediaType} = req.body

    if(!req.file){
        throw new apiError(400, "media is required")
    }

    const uplaodResponse = await uploadOnCloudinary(req.file?.path)

    if(!uplaodResponse){
        throw new apiError(500, "failed to upload media")
    }

    const story = await Story.create({
        author: req.user._id,
        mediaType,
        media: uplaodResponse.secure_url,
        mediaPublicId: uplaodResponse.public_id
    })

    user.story = story._id

    await story.save()

    const populatedStory = await Story.findById(story._id)
    .populate("author", "name userName profileImage")
    .populate("viewers", "name userName profileImage")

    return res
    .status(200)
    .json(new apiResponse(200, populatedStory))
})

export const viewStory = asyncHandler(async(req, res) => {
    const storyId = req.params.storyId
    const story = await Story.findById(storyId)

    if(!story){
        throw new apiError(400, "story not found")
    }

    const viewersIds = story.viewers.map((id) => id.toString())

    if(!viewersIds.includes(req.user._id.toString())){
        story.viewers.push(req.user._id)
        await story.save()
    }

    const populatedStory = await Story.findById(story._id)
    .populate("author", "name userName profileImage")
    .populate("viewers", "name userName profileImage")

    return res
    .status(200)
    .json(new apiResponse(200, populatedStory))
})

export const getStoryByUserName = asyncHandler(async(req, res) => {
    const userName = req.params.userName

    const user = await User.findOne({userName})

    if(!user){
        throw new apiError(400, "user not found")
    }

    const story = await Story.find({author: user._id})
    .populate("viewers author")

    return res
    .status(200)
    .json(new apiResponse(200, story))
})

export const getAllStories = asyncHandler(async(req, res) => {
    const currentUser = await User.findById(req.user._id)

    const authors = [...currentUser.following, currentUser._id]

    const followingIds = currentUser.following

    const stories = await Story.find({
        author: {$in: authors}
    })
    .populate("viewers author")
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(new apiResponse(200, stories))
})

export const deleteStory = asyncHandler(async(req, res) => {
    const {storyId} = req.params
    const userId = req.user._id

    const story = await Story.findById(storyId)

    if(!story){
        throw new apiError(404, "error while getting story")
    }

    if(story.author.toString() !== userId.toString()){
        throw new apiError(403, "you are not authorized to delete this story")
    }

    if(story.mediaPublicId){
        await deleteFromCloudinary(story.mediaPublicId, story.mediaType)
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $pull: {
                story: story._id
            }
        }
    )

    await story.deleteOne()

    return res
    .status(200)
    .json(new apiResponse(200, null, "story deleted successfully"))
})