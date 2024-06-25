/* eslint-disable no-plusplus */
/**
 * user.js
 * @description :: model of a database collection user
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const idValidator = require('mongoose-id-validator');
const bcrypt = require('bcrypt');
const {
  USER_ROLE, CATEGORY,
} = require('../constants/authConstant');
const { convertObjectToEnum } = require('../utils/common');

const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {

    username: {
      type: String,
      required: true,
      unique: true,
    },

    nickname: { type: String },

    name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    city: { type: String },

    postcode: { type: String },

    country: { type: String },

    latitude: { type: String },

    longitude: { type: String },

    password: {
      type: String,
      required: true,
    },
    categories: {
      type: [Number],
      enum: convertObjectToEnum(CATEGORY),
      validate: {
        validator (arr) {
          return arr.every((value) => convertObjectToEnum(CATEGORY).includes(value));
        },
        message: (props) => `${props.value} contains invalid category!`,
      },
    },
    socialLink: {
      whatsapp_number: String,
      presentation: String,
      instagram: String,
      facebook: String,
      snapchat: String,
      tiktok: String,
      twitter: String,
      telegram: String,
    },

    isActive: { type: Boolean },

    createdAt: { type: Date },

    updatedAt: { type: Date },

    isDeleted: { type: Boolean },

    role: {
      type: Number,
      enum: convertObjectToEnum(USER_ROLE),
      required: true,
    },

    resetPasswordLink: {
      code: String,
      expireTime: Date,
    },

    loginRetryLimit: {
      type: Number,
      default: 0,
    },

    loginReactiveTime: { type: Date },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.pre('insertMany', async (next, docs) => {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method('toJSON', function () {
  const {
    _id, __v, ...object
  } = this.toObject({ virtuals: true });
  object.id = _id;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const user = mongoose.model('user', schema, 'user');
module.exports = user;
