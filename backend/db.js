const mongoose=require("mongoose");

mongoose.connect('mongodb+srv://gauravgoswami1304_db_user:R4o0euNeqarofyvf@cluster0.di26mr1.mongodb.net/paytmApp');

// schema initialization
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// model initialization
const User=mongoose.model("User",userSchema);

module.exports={
    User
}