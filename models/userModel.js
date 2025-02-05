import { Schema, model } from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please tell as your name!"],
    unique: true,
    trim: true,
  },
  slug: String,
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

// userSchema.pre("save", function(next) {
//   this.slug = slugify(this.username, { lower: true });
//   next();
// });

// userSchema.post('save', function (doc, next) {
//   next();
// })

// userSchema.pre(/^find/, function (next) {

//   next();
// });

const User = model("User", userSchema);
export default User;
