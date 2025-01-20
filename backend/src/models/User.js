const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const FileMetaData = require('./FileMetaData');

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

userSchema.statics.findByEmailOrId = function (userEmailOrId) {
  const query = mongoose.Types.ObjectId.isValid(userEmailOrId)
      ? { _id: userEmailOrId, isDeleted: false }
      : { email: userEmailOrId, isDeleted: false };
  return this.findOne(query).sort({ createdAt: -1 });
};

userSchema.methods.getFiles = async function (type = null, single = false) {
  const query = { model: 'User', modelId: this._id };
  if (type) {
      query.type = type;
  }
  if (single) {
    return await FileMetaData.findOne(query);
  } else {
    return await FileMetaData.find(query);
  }
};


module.exports = mongoose.model('User', userSchema);
