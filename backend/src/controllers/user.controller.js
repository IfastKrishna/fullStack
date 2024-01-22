import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //   get user data from frontend
  //  check valid user data
  // check user allready exits in database emai or username
  //   check user avtar (images)
  //   uplde them to cloudinary avtar

  // create user object  create entry in db
  // remove password and refresh token from response
  //   check for user creation
  // if user is created successfully so retun user response
  // if faild so retrun erro response

  // 1 get user data from frontend
  const { username, email, password, fullName } = req.body;

  // Check for empty fields
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  // check user exists already
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  console.log("REQUEST FILES :: ", req.files);
  // check avatar fuke give user or not
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    req.files.coverImage &&
    Array.isArray(req.files.coverImage.files) &&
    req.files.coverImage.files.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  // Upload avatar to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if Uploading is failed
  if (!avatar) {
    throw new ApiError(`Uploading avatar failed please try again`);
  }

  // Create user in the database
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // verify use was created and  Retrieve user without sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // if user not created then throw error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong whie registering the user");
  }

  // return success response
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

export { registerUser };

// video 16 and timeline 5:17
