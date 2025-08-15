const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const feeMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  loanId: { type: "keyword", index: true },
  amount: { type: "double", index: false },
  currency: { type: "keyword", index: false },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  statusUpdateDate: { type: "date", index: false },
  reason: { type: "keyword", index: true },
  note: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const feePaymentMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  feeId: { type: "keyword", index: true },
  amountPaid: { type: "double", index: false },
  currency: { type: "keyword", index: false },
  userId: { type: "keyword", index: true },
  paymentMethod: { type: "keyword", index: false },
  paymentMethod_: { type: "keyword" },
  paymentStatus: { type: "keyword", index: true },
  paymentStatus_: { type: "keyword" },
  paymentDate: { type: "date", index: false },
  stripePaymentIntentId: { type: "keyword", index: false },
  handledByUserId: { type: "keyword", index: false },
  note: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const feeEventMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  feeId: { type: "keyword", index: true },
  eventType: { type: "keyword", index: true },
  eventType_: { type: "keyword" },
  eventDate: { type: "date", index: false },
  actorUserId: { type: "keyword", index: true },
  note: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const feePaymentMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  ownerId: { type: "keyword", index: true },
  orderId: { type: "keyword", index: true },
  paymentId: { type: "keyword", index: true },
  paymentStatus: { type: "keyword", index: true },
  statusLiteral: { type: "keyword", index: true },
  redirectUrl: { type: "keyword", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const paymentCustomerMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  customerId: { type: "keyword", index: true },
  platform: { type: "keyword", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const paymentMethodMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  paymentMethodId: { type: "keyword", index: true },
  userId: { type: "keyword", index: true },
  customerId: { type: "keyword", index: true },
  cardHolderName: { type: "keyword", index: true },
  cardHolderZip: { type: "keyword", index: true },
  platform: { type: "keyword", index: true },
  cardInfo: { properties: {} },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("fee", feeMapping);
    await new ElasticIndexer("fee").updateMapping(feeMapping);
    ElasticIndexer.addMapping("feePayment", feePaymentMapping);
    await new ElasticIndexer("feePayment").updateMapping(feePaymentMapping);
    ElasticIndexer.addMapping("feeEvent", feeEventMapping);
    await new ElasticIndexer("feeEvent").updateMapping(feeEventMapping);
    ElasticIndexer.addMapping("feePayment", feePaymentMapping);
    await new ElasticIndexer("feePayment").updateMapping(feePaymentMapping);
    ElasticIndexer.addMapping("paymentCustomer", paymentCustomerMapping);
    await new ElasticIndexer("paymentCustomer").updateMapping(
      paymentCustomerMapping,
    );
    ElasticIndexer.addMapping("paymentMethod", paymentMethodMapping);
    await new ElasticIndexer("paymentMethod").updateMapping(
      paymentMethodMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
