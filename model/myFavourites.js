/* eslint-disable no-plusplus */
/**
 * myFavourites.js
 * @description :: model of a database collection myFavourites
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const idValidator = require('mongoose-id-validator');

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

    favouriteByUserId: { type: String },

    favouriteUserId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    isActive: { type: Boolean },

    createdAt: { type: String },

    updatedAt: { type: String },

    isDeleted: { type: Boolean },

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

schema.virtual('user', {
  ref: 'user',
  localField: 'favouriteUserId',
  foreignField: '_id',
  justOne: true,
});

schema.method('toJSON', function () {
  const {
    _id, __v, ...object
  } = this.toObject({ virtuals: true });
  object.id = _id;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const myFavourites = mongoose.model('myFavourites', schema, 'myFavourites');
module.exports = myFavourites;
