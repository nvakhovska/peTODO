import { Schema, model } from "mongoose";
import slugify from "slugify";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: String,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
});

userSchema.pre("save", function(next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});

// userSchema.post('save', function (doc, next) {
//   next();
// })

// userSchema.pre(/^find/, function (next) {

//   next();
// });

const User = model("User", userSchema);
export default User;
