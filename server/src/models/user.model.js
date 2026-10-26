import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    refreshTokenHash: {
      type: String,
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
