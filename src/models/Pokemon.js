import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const PokemonSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    height: Number,
    weight: Number,
  },
  {
    timestamps: true,
    // virtuals: true,
  });

PokemonSchema.static('fat', function fat() {
  return this;
});
//   .get(function () {
//     return this.weight / this.height;
//   });

PokemonSchema.methods.toJSON = function pick() {
  return _.pick(this, ['url', 'name', 'height', 'weight', 'fat']);
};

export default mongoose.model('Pokemon', PokemonSchema);
