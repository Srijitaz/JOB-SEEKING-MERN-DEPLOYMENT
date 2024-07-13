import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, "Please provide your name"],
        minLength: [3, "Name must contain atleast 3 characters!"],
        maxLength: [30, "Name must cannot exceed 30 characters!"],
    },
    email :{
        type: String,
        required: [true, "Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email"],
    },

    phone: {
        type: Number,
        required: [true, "Please provide your number"]
    },

    password:{
        type: String,
        required: [true, "Please type a password"],
        minLength: [8, "Name must contain atleast 8 characters!"],
        maxLength: [32, "Name must cannot exceed 32 characters!"],
        select: false,
    },
    role:{
        type: String,
        required: [true, "PLease provide you role"],
        enum: ["Job Seeker","Employer"],
    },

    createdAt:{
        type: Date,
        default: Date.now,
    },
});

//Hashing pwd

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});


//comparing password

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate jwt token authorization

userSchema.methods.getJWTToken = function(){
    return jwt.sign({ id: this._id },process.env.JWT_SECRET_KEY ,{
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);