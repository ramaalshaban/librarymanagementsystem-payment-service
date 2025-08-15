const { mongoose } = require("common");
const { Schema } = mongoose;
const feeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    loanId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
      defaultValue: 0,
    },
    currency: {
      type: String,
      required: true,
      defaultValue: "USD",
    },
    status: {
      type: String,
      required: true,
      defaultValue: "unpaid",
    },
    statusUpdateDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
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

feeSchema.set("versionKey", "recordVersion");
feeSchema.set("timestamps", true);

feeSchema.set("toObject", { virtuals: true });
feeSchema.set("toJSON", { virtuals: true });

module.exports = feeSchema;
