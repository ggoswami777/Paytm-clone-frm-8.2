const express=require("express");
const userRouter=require("./user")

const accountRouter=require("./account")
const router=express.Router();

router.use("/user",userRouter);
router.use("/account",accountRouter);
router.get("/test", (req, res) => {
  res.json({ message: "Main router working" });
});

module.exports=router;
