import mongoose from 'mongoose';
import _ from 'lodash';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

const { Schema } = mongoose;

const PetSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['cat', 'dog', 'rat'],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
},
  {
    timestamps: true,
    // toObject: { virtuals: true },
    // toJSON: { virtuals: true },
  });

PetSchema.plugin(autoIncrement.plugin, { model: 'Pet', field: 'id' });

PetSchema.virtual('user', {
  ref: 'User', // The model to use
  localField: 'userId', // Find people where `localField`
  foreignField: 'id', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

PetSchema.methods.toJSON = function pick() {
  const result = _.pick(this, ['id', 'userId', 'type', 'color', 'age', 'user']);
  return _.pickBy(result, (value, key) => !(key === 'user' && value === null));
};

export default mongoose.model('Pet', PetSchema);
