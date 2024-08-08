/* eslint-disable no-plusplus */
/**
 * chatRelationship.js
 * @description :: model of a database collection chatRelationship
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

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    lastMessage: { type: String },

    lastMessageTime: { type: Schema.Types.Date },

    unReadMessageCount: { type: Schema.Types.Number },

    isDeleted: { type: Boolean },

    isActive: { type: Boolean },

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

schema.virtual('userIdData', {
  ref: 'user',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'username name last_name isPremium avatar' },
});
schema.virtual('receiverIdData', {
  ref: 'user',
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'username name last_name isPremium avatar' },
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

const chatRelationship = mongoose.model('chatRelationship', schema, 'chatRelationship');
module.exports = chatRelationship;
