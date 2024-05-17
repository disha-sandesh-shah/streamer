import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js" 

const registerUser = asyncHandler(async (req, res) => {
    // Get user details from Front-End
    // Validation - Non-Empty Check
    // Check if user already exists
    // Check for files - Avatar and CoverImage
    // Upload on Cloudinary
    // Create user object and create entry in db
    // Remove accessToken and Password from object
    // Check if user created
    // Return response

    const {username, email, fullName, password} = req.body;
    console.log(req.body);

    if([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const existingUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser) {
        throw new ApiError(409, "User with given email or username already exists!");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar File is required!");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
    })

    const createdUser = User.findById(user._id).select(
        "refreshToken -password"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user!");
    }

    res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    )
})

export { registerUser };