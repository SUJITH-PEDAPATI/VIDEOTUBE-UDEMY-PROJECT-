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
        }
    }
)

// Here a database is being created with the help of Mongoose and it is referred as "User"
export const User = mongoose.model("User",userSchema);