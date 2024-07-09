const { Schema, model } = require('mongoose')

const EventSchema = new Schema({
  title: String,
  notes: String,
  start: Date,
  end: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

// EventSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   }
// });

EventSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

module.exports = model('Event', EventSchema)
