const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");


const router = express.Router();
// signUp body
const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string()
});

// signIn  Body

const signinBody=zod.object({
  username:zod.string().email(),
  password:zod.string()
})

// updating the info of user in database
const updateBody=zod.object({
  password:zod.string().optional(),
  firstName:zod.string().optional(),
  lastName:zod.string().optional(),
})

// post request for user signup
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs"
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken"
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token
  });
});

// post request for signin of user
router.post("/signin",async(req,res)=>{
  const {success}=signinBody.safeParse(req.body)
  if(!success){
    return res.status(411).json({
      message:"Incorrect inputs"
    })
  }
  const user=await User.findOne({
    username:req.body.username,
    password:req.body.password
  })
  if(user){
    const token=jwt.sign({
      userId:user._id
    },JWT_SECRET);
    res.json({
      token:token
    })
    return;
  }
  res.json(411).json({
    message:"Error while logging in"
  })
})

// post request to update user's info
router.put("/",authMiddleware,async (req,res)=>{
  const {success}=updateBody.safeParse(req.body);
  if(!success){
    res.status(411).json({
      message:"Error while updating Information"
    })
  }
})

// Route to get users from the backend, filterable via firstName/lastName

router.get("/bulk",async (req,res)=>{
  const filter=req.query.filter || "";
  const users=await User.find({
    $or:[{
      firstName:{
        "$regex":filter
      }
    },{
      lastName:{
        "$regex":filter
      }
    }
  ]
  })
  res.json({
    user:users.map(user=>({
      username:user.username,
      firstName:user.firstName,
      lastName:user.lastName,
      _id:user._id
    }))
  })
})

module.exports = router;
