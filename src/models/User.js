import mongoose from 'mongoose';
import _ from 'lodash';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  values: {
    money: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
  },
},
  {
    timestamps: true,
  });

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id' });

UserSchema.virtual('pets', {
  ref: 'Pet', // The model to use
  localField: 'id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
});

class UserClass {
  toJSON() {
    const result = _.pick(this, ['id', 'username', 'fullname', 'password', 'values', 'pets']);
    return _.pickBy(result, (value, key) => !(key === 'pets' && value === null));
  }
}

UserSchema.loadClass(UserClass);
export default mongoose.model('User', UserSchema);
