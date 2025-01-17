const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  dateofbirth: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  country_code: {
    type: String,
    required: false
  },
  mobile_number: {
    type: String,
    required: false
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  await this.save();
};

userSchema.statics.findNonDeleted = function() {
  return this.find({ isDeleted: false });
};

userSchema.statics.findByEmailOrId = async function(userEmailOrId) {
  if (mongoose.Types.ObjectId.isValid(userEmailOrId)) {
    return this.findOne({ _id: userEmailOrId, isDeleted: false }).sort({ createdAt: -1 });
  } else {
    return this.findOne({ email: userEmailOrId, isDeleted: false }).sort({ createdAt: -1 });
  }
};

module.exports = mongoose.model('User', userSchema);
