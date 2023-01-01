const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "built-in",
  },

  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
  },

  email_verified: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: [true, "Password field is required"],
    minLegth: [6, "Password must have at least 6 character"],
  },

  name: {
    type: String,
  },

  image: {
    profile: {
      title: {
        type: String,
      },

      buffer: {
        type: Buffer,
      },

      createdAt: {
        type: String,
      },
    },
  },

  createdAt: {
    type: String,
    required: [true, "CreatedAt field is required"],
    default: Date(),
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (error, hash) => {
    if (error) return next(error);
    user.password = hash;
    next();
  });
});

const User = mongoose.model("user", userSchema);

module.exports = { User };
