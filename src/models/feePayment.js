const { mongoose } = require("common");
const { Schema } = mongoose;
const feepaymentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: false,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    statusLiteral: {
      type: String,
      required: true,
      defaultValue: "started",
    },
    redirectUrl: {
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

feepaymentSchema.set("versionKey", "recordVersion");
feepaymentSchema.set("timestamps", true);

feepaymentSchema.set("toObject", { virtuals: true });
feepaymentSchema.set("toJSON", { virtuals: true });

module.exports = feepaymentSchema;
, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

feepaymentSchema.set("versionKey", "recordVersion");
feepaymentSchema.set("timestamps", true);

feepaymentSchema.set("toObject", { virtuals: true });
feepaymentSchema.set("toJSON", { virtuals: true });

module.exports = feepaymentSchema;
