const { mongoose } = require("common");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");

const feeSchema = require("./fee");

const feepaymentSchema = require("./feePayment");

const feeeventSchema = require("./feeEvent");

const feepaymentSchema = require("./feePayment");

const paymentcustomerSchema = require("./paymentCustomer");

const paymentmethodSchema = require("./paymentMethod");

feeSchema.methods.getCqrsJoins = async function (data) {};

feeSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const statusOptions = [
    "unpaid",
    "paymentInProgress",
    "paid",
    "waived",
    "canceled",
  ];
  if (ret.status != null) {
    const enumIndex =
      typeof ret.status === "string"
        ? statusOptions.indexOf(ret.status)
        : ret.status;
    ret.status_idx = enumIndex;
    ret.status = enumIndex > -1 ? statusOptions[enumIndex] : undefined;
  }

  return ret;
};

feepaymentSchema.methods.getCqrsJoins = async function (data) {};

feepaymentSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const paymentMethodOptions = ["stripe", "cash", "pos", "other"];
  if (ret.paymentMethod != null) {
    const enumIndex =
      typeof ret.paymentMethod === "string"
        ? paymentMethodOptions.indexOf(ret.paymentMethod)
        : ret.paymentMethod;
    ret.paymentMethod_idx = enumIndex;
    ret.paymentMethod =
      enumIndex > -1 ? paymentMethodOptions[enumIndex] : undefined;
  }
  const paymentStatusOptions = ["pending", "complete", "failed", "canceled"];
  if (ret.paymentStatus != null) {
    const enumIndex =
      typeof ret.paymentStatus === "string"
        ? paymentStatusOptions.indexOf(ret.paymentStatus)
        : ret.paymentStatus;
    ret.paymentStatus_idx = enumIndex;
    ret.paymentStatus =
      enumIndex > -1 ? paymentStatusOptions[enumIndex] : undefined;
  }

  return ret;
};

feeeventSchema.methods.getCqrsJoins = async function (data) {};

feeeventSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const eventTypeOptions = [
    "assessed",
    "paymentAttempt",
    "paymentSuccess",
    "paymentFail",
    "waived",
    "canceled",
    "note",
  ];
  if (ret.eventType != null) {
    const enumIndex =
      typeof ret.eventType === "string"
        ? eventTypeOptions.indexOf(ret.eventType)
        : ret.eventType;
    ret.eventType_idx = enumIndex;
    ret.eventType = enumIndex > -1 ? eventTypeOptions[enumIndex] : undefined;
  }

  return ret;
};

feepaymentSchema.methods.getCqrsJoins = async function (data) {};

feepaymentSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  ret._owner = ret.ownerId ?? undefined;

  return ret;
};

paymentcustomerSchema.methods.getCqrsJoins = async function (data) {};

paymentcustomerSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  ret._owner = ret.userId ?? undefined;

  return ret;
};

paymentmethodSchema.methods.getCqrsJoins = async function (data) {};

paymentmethodSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  ret._owner = ret.userId ?? undefined;

  return ret;
};

const Fee = mongoose.model("Fee", feeSchema);
const FeePayment = mongoose.model("FeePayment", feepaymentSchema);
const FeeEvent = mongoose.model("FeeEvent", feeeventSchema);
const FeePayment = mongoose.model("FeePayment", feepaymentSchema);
const PaymentCustomer = mongoose.model(
  "PaymentCustomer",
  paymentcustomerSchema,
);
const PaymentMethod = mongoose.model("PaymentMethod", paymentmethodSchema);

module.exports = {
  Fee,
  FeePayment,
  FeeEvent,
  FeePayment,
  PaymentCustomer,
  PaymentMethod,
  updateElasticIndexMappings,
};
