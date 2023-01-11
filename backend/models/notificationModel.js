import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        targetedUser: {
            type: mongoose.Schema.Types.ObjectId,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
        },
        SME: {
            type: mongoose.Schema.Types.ObjectId,
        },
        date: {
            type: Date,
        },
        notificationStatus: {
            type: String,
            default: "unread",
            enum: ['unread', 'read']
        },
        message: {
            type: String,
        }
    }
)

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;