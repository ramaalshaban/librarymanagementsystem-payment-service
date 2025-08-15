const { mongoose } = require("common");
const { Schema } = mongoose;
const paymentmethodSchema = new mongoose.Schema(
  {
    paymentMethodId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    cardHolderName: {
      type: String,
      required: false,
    },
    cardHolderZip: {
      type: String,
      required: false,
    },
    platform: {
      type: String,
      required: true,
      defaultValue: "stripe",
    },
    cardInfo: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

paymentmethodSchema.set("versionKey", "recordVersion");
paymentmethodSchema.set("timestamps", true);

paymentmethodSchema.set("toObject", { virtuals: true });
paymentmethodSchema.set("toJSON", { virtuals: true });

module.exports = paymentmethodSchema;
