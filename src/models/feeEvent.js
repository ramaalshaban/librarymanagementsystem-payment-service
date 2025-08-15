const { mongoose } = require("common");
const { Schema } = mongoose;
const feeeventSchema = new mongoose.Schema(
  {
    feeId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      defaultValue: "assessed",
    },
    eventDate: {
      type: Date,
      required: true,
    },
    actorUserId: {
      type: String,
      required: true,
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

feeeventSchema.set("versionKey", "recordVersion");
feeeventSchema.set("timestamps", true);

feeeventSchema.set("toObject", { virtuals: true });
feeeventSchema.set("toJSON", { virtuals: true });

module.exports = feeeventSchema;
