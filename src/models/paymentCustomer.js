const { mongoose } = require("common");
const { Schema } = mongoose;
const paymentcustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
      unique: true,
    },
    customerId: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      required: true,
      defaultValue: "stripe",
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

paymentcustomerSchema.set("versionKey", "recordVersion");
paymentcustomerSchema.set("timestamps", true);

paymentcustomerSchema.set("toObject", { virtuals: true });
paymentcustomerSchema.set("toJSON", { virtuals: true });

module.exports = paymentcustomerSchema;
