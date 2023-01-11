import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    zipcode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    otp:{
      type: Number,
    },
    dateOfBirth: {
      type: Date,
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "SME", "Superadmin"]
    },
    status: {
      type: Boolean,
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    subCategories: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    linkedinProfile: {
      type: String,
    },
    ratings: {
      type: Number,
    },
    bio: {
      type: String,
    },
    isApproved: {
      type: String,
      default: "pending",
      enum:['pending','rejected','approved']
    },
    isOnline: {
      type: Boolean,
    },
    advisorReviews: {
      type: Array,
      default: [],
    },
    clientReviews: {
      type: Array,
      default: [],
    },
    sessionComments:{
      type: String,
    },
    Msg:{
      type: String,
    },
    additionalDocuments: [{
      type: String,
    }],
  },
  { timestamps: true }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchema);
export default User;
