const mongoose = require('mongoose');

const gptMessageSchema = new mongoose.Schema(
  {
    response: {
      type: String,
      required: [true, 'Response is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
      enum: ['tip', 'recipe']
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const GPTMessage = mongoose.model('GPTMessage', gptMessageSchema);
module.exports = GPTMessage;
