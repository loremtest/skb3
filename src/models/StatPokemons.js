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

class StatPokemonsClass {
  static updateTotal(total) {
    return this.findOneAndUpdate(
      {},
      { total },
      { new: true, upsert: true },
    );
  }

  static updateSuccess(success) {
    return this.findOneAndUpdate(
      {},
      { $inc: { success } },
      { new: true, upsert: true },
    );
  }

  static updatePageUrl(pageUrl) {
    return this.findOneAndUpdate(
      {},
      { pageUrl },
      { new: true, upsert: true },
    );
  }

  toJSON() {
    return _.pick(this, ['pageUrl', 'success']);
  }
}

StatPokemonsSchema.loadClass(StatPokemonsClass);
export default mongoose.model(modelName, StatPokemonsSchema);
