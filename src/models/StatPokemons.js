import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;
const modelName = 'StatPokemons';

const StatPokemonsSchema = new Schema(
  {
    pageUrl: String,
    total: {
      type: Number,
      default: 0,
    },
    success: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  });

StatPokemonsSchema.statics.updateTotal = function updateTotalNeed(total) {
  return mongoose.model(modelName).findOneAndUpdate(
    {},
    { total },
    { new: true, upsert: true },
  );
};

StatPokemonsSchema.statics.updateSuccess = function updateSuccessCount(success) {
  return mongoose.model(modelName).findOneAndUpdate(
    {},
    { $inc: { success } },
    { new: true, upsert: true },
  );
};

StatPokemonsSchema.statics.updatePageUrl = function updatePageUrl(pageUrl) {
  return mongoose.model(modelName).findOneAndUpdate(
    {},
    { pageUrl },
    { new: true, upsert: true },
  );
};

StatPokemonsSchema.methods.toJSON = function toJSON() {
  return _.pick(this, ['pageUrl', 'success']);
};

export default mongoose.model(modelName, StatPokemonsSchema);
