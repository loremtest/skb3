import mongoose from 'mongoose';

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
  });

class PokemonClass {
  static getByMetric(metric, query = {}) {
    let limit = Number(query.limit);
    limit = (limit && limit > 0 && limit < 500) ? limit : 20;

    let offset = Number(query.offset);
    offset = (offset && offset > 0) ? offset : 0;

    const fields = {};
    let sort = {};

    switch (metric) {
      case 'fat':
        fields.fat = { $divide: ['$weight', '$height'] };
        sort = { fat: -1 };
        break;

      case 'angular':
        fields.angular = { $divide: ['$weight', '$height'] };
        sort = { angular: 1 };
        break;

      case 'heavy':
        fields.weight = true;
        sort = { weight: -1 };
        break;

      case 'light':
        fields.weight = true;
        sort = { weight: 1 };
        break;

      case 'huge':
        fields.height = true;
        sort = { height: -1 };
        break;

      case 'micro':
        fields.height = true;
        sort = { height: 1 };
        break;
      default:
        sort = {};
    }

    sort = {
      ...sort,
      name: 1,
    };

    return this.model('Pokemon').aggregate([
      {
        $project: {
          _id: false,
          name: true,
          ...fields,
        },
      },
      { $sort: sort },
      { $skip: offset },
      { $limit: limit },
    ]);
  }
}

PokemonSchema.loadClass(PokemonClass);
export default mongoose.model('Pokemon', PokemonSchema);
