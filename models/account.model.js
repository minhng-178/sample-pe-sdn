import mongoose from "mongoose";
import bcrypt from "bcrypt";
const accounSchema = new mongoose.Schema({
  us: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
});

// hash password
accounSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.pw = await bcrypt.hash(this.pw, 10);
  next();
});

const accountModel = mongoose.model("Accounts", accounSchema);

export default accountModel;
