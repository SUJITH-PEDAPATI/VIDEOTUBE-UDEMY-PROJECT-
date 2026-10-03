/* 
    _id string pk // This is automatically handled by the Mongoose (Mongo DB)
  videoFile string
  thumbNail string
  owner ObjectId users
  title content
  description content
  duration string
  views number
  isPublished boolean
  createdAt Date
  updatedAt Date
   -- Bought directly from the eraser
*/

import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // Cloudanary URL
            required: true,
        },
        thumbnail: {
            type: String, // Cloudanary URL
            required: true,
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String,
            required: true,

        },
        views: {
            type: Number,
            default: 0,
        },
        duration: {
            type: Number,
            required: true
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: { // This explains that the owner in the videoSchema is related to the User !!
            type: Schema.Types.ObjectId, // Type is a Schema
            ref: "User" // Reffered to User!
        }
    },
    {timestamps: true}
)
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video",videoSchema);