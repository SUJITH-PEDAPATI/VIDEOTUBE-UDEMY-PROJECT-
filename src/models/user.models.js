import mongoose, {Schema} from "mongoose";
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
export const User = mongoose.model("User",userSchema);