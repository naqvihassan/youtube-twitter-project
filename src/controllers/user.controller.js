import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/ApiResponce.js"

const registerUser = asyncHandler(async (req, res) => {
    //  get user details from frontend
    //  validation - not empty
    //  check i user already exists: username/email
    //  check for images, check for avatar
    //  upload tham to cloudinary, avatar
    //  create user object - create entry in database
    //  remove password and refresh token field from responce
    //  check for user creation
    //  return res/err



    const { fullName, email, username, password } = req.body
    console.log("email: ", email);

    if(
        [fullName, email, username, password].some((field) => 
        field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already existed");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path 
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log(avatarLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar files is required")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar)
    {
        throw new ApiError(400, "Avatar files is required")
    }

    const user = await User.create ({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponce(200, createUser, "User registered Successfuly")
    )
})

export { registerUser }