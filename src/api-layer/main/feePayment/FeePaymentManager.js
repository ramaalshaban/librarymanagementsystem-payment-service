const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const PaymentServiceManager = require("../../service-manager/PaymentServiceManager");

/* Base Class For the Crud Routes Of DbObject FeePayment */
class FeePaymentManager extends PaymentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "feePayment";
    this.modelName = "FeePayment";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = FeePaymentManager;
