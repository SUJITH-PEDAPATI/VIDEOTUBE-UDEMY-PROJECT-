import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, /// Cloudanary URL
            required: true,
        },
        coverImage: {
            type: String, 
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true,"Password is Required"], // This is an array whcih takes (boolean,Error Message) -> The first boolean value determines the value, it is definetly required, and the Error Message is sent to the front-end.
        },
        refreshToken: {
            type: String,
        }
    },
    { timestamps: true} // This automatically creates the fields: Created At and Updated At
)

// Here a database is being created with the help of Mongoose and it is referred as "User"

userSchema.pre("save", async function (next){
    if (!this.modified("password")) return next();
    this.password = bcrypt.hash(this.password,10);
    next(); // Passes onto the next hook or the next prehook or the next operation
});

// The following defined method compares the original password and the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = function () {
    // short Lived access token
    return jwt.sign({
        _id: this._id ,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function () {
    // short Lived access token
    return jwt.sign({
        _id: this._id ,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}
export const User = mongoose.model("User",userSchema);