import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import Razorpay from "razorpay";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import Notification from "../models/notificationModel.js";
dotenv.config();

// email config
const API_KEY = process.env.MAIL_API_KEY;
sgMail.setApiKey(API_KEY);


// payment config
app.use(
  cors({
      origin:["http://localhost:8090"],
      methods: ["GET","POST"],
      credentials: true,
  })
);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, role, dateOfBirth, categories, subCategories, linkedinProfile } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    role,
    dateOfBirth, 
    categories, 
    subCategories, 
    linkedinProfile
  });
  if (user) {
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  console.log("registered")
});



// @desc    Get all users
// @route   Get /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   Delete /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   Get /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// @desc    get all advisor sessions
// @route   GET /api/users/advisorSession
// @access  Private/Advisor
const advisorSessions = asyncHandler(async(req, res) => {
  const session = Session.find({})
  res.json(session);
})


// @desc    get experts
// @route   GET /api/users/experts
// @access  Public
const getExpert = asyncHandler(async(req, res) => {
  const {categories, subCategories} = req.body;
  const users = await User.find({isApproved : true && isOnline == true && categories.includes(category) && subCategories.includes(subCategory)});
  res.json(users);
});


// @desc    approve user
// @route   PUT /api/users/:id/approveUser
// @access  Private/Admin
const approveUser = asyncHandler(async(req, res) => {
  const user = await User.findById(req.params.id);
  if( user.isApproved == "false"){
    user.isApproved = True;
  }else {
    res.status(403);
    throw new Error(" User not approved")
  }
})

// @desc    verify user
// @route   POST /api/users/verify
// @access  Public
const verify = asyncHandler(async(req, res) => {
  const { email } = req.body;

})

// @desc    update advisor profile
// @route   PUT /api/users/updateAdvisorProfile
// @access  Private/Advisor
const updateAdvisorProfile = asyncHandler(async(req, res) => {

})

// @desc    update user profile
// @route   PUT /api/users/updateUserProfile
// @access  Private/User
const updateUserProfile = asyncHandler(async(req, res) => {

})

const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const message = {
      to: email,
      from: 'shahjatan88@gmail.com',
      subject: 'test email',
      text: 'Hello from jatan',
    }
    sgMail.send(message)
    .then(() => {
      res.send(message)
    })
    .catch(err => res.send(err));
  }

});

const payTip = asyncHandler(async (req, res) => {
  const tip = req.body.tip;

  var instance = new Razorpay({ 
    key_id: process.env.KEY_ID, 
    key_secret: process.env.KEY_SECRET
  });

  var options = {
    tip: tip * 100, 
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  const myOrder = await instance.orders.create(options)

  console.log(myOrder);

});





export {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  advisorSessions,
  getExpert,
  approveUser,
  verify,
  updateAdvisorProfile,
  updateUserProfile,
  resetPassword,
  payTip
};
