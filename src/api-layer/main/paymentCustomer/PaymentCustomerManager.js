const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const PaymentServiceManager = require("../../service-manager/PaymentServiceManager");

/* Base Class For the Crud Routes Of DbObject PaymentCustomer */
class PaymentCustomerManager extends PaymentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "paymentCustomer";
    this.modelName = "PaymentCustomer";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = PaymentCustomerManager;
