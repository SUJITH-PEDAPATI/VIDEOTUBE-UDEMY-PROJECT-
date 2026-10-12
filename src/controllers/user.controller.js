import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAceessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId);
        if (!user){
            return ApiError(
                400,
                "UnExpected Error: User Not Found!"
            )
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    } catch (error) {
        return new ApiError(500, "Something Went wrong while generating the refresh and Access Token")
    }

}

const registerUser = asyncHandler(async(req,res) => {
    const {fullname,email,username,password} = req.body;

    // Validation
    if ([fullname,email,username,password].some((field) => field?.trim() === "")){ // field? -- avoids crashing if the field is empty
        throw new ApiError(
            400,
            "All Fields are Required!"
        )
    }
    const existedUser = await User.findOne({
        $or: [{username},{email}] // Searches the User based on the email or username
    });
    
    if (existedUser) throw new ApiError(409, "User with Email or username is already existed!");

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if ( !avatarLocalPath) throw new ApiError(400, "Avatar File is Missing!")
    // let coverImage = "";

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // if (!avatar.secure_url) throw new ApiError(500, "Error While Uploading Avatar on Cloudinary");

    // if ( coverImageLocalPath ) {
        
    //     const UploadedcoverImage = await uploadOnCloudinary(coverImageLocalPath);
    //     if (!UploadedcoverImage.secure_url) throw new ApiError(500, "Error While Uploading Cover Image on Cloudinary");
    //     coverImage = UploadedcoverImage.secure_url;
    // }

    let avatar;
    try{
        avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("Uploaded Avatar",avatar)
    }catch(error){
        console.log(`Error on Clodinary: ${error}`);
        throw new ApiError(500, "Error While Uploading Avatar on Cloudinary");
    }

    let coverImage;
    try{
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
        console.log("Uploaded Cover Image",coverImage)
    }catch(error){
        console.log(`Error on Clodinary: ${error}`);
        throw new ApiError(500, "Error While Uploading Cover Image on Cloudinary");
    }

    try{
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage.url || "",
            email,
            password,
            username: username.toLowerCase(),
        });

        // An extra DB Call is made so as to improve the realiability and reduce the errors

        const createdUser = await User.findById(id=user._id).select(
            "-password -refreshToken" // Select function indicating a  '-' helps in elimnating the fields
        )
        if (!createdUser) throw new ApiError(500, "Something Went Wrong While registering the User")

        return res  
            .status(201)
            .json( new ApiResponse (
                201,
                "Created User Registering Successfully!"
            ))
    } catch(error){
        console.log("User Creation Failed!");
        if ( avatar) {
            await deleteFromCloudinary(avatar.public_id);
        }
        if ( coverImage){
            await deleteFromCloudinary(coverImage.public_id);
        }

        throw new ApiError(500, "Something Went Wrong while registering a User and Images were deleted");
    }
});

const logOut = asyncHandler(async(req,res) => {
    // Get the data from the body
    const {email,username,password} = req.body;
    if (!email) throw new ApiError(400, "Email is Required!");
    if (!username) throw new ApiError(400, "Username is Required!");
    if (!password) throw new ApiError(400, "Password is Required!");

    const user = await User.findOne({
        $or: [{username},{email}]
    });

    if (!user) return new ApiError(404, "User Not Found!");
    
    // Validating the Password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) return new ApiError(404, "Invalid Credentials!");

    const {accessToken,refreshToken} = await generateAceessAndRefreshToken(user._id);

    const loggedInUser = await user.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // doesnot change the refreshTOken once it gets generated! 
    }

    return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",refreshToken, options)
        .json( new ApiResponse(
            200,
            {user: loggedInUser, accessToken, refreshToken},
            "User LoggedIn Successfully!"
        ))
})


export {
    registerUser,
    logOut,
    generateAceessAndRefreshToken
};