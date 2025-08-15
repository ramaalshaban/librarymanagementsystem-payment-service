const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const PaymentServiceManager = require("../../service-manager/PaymentServiceManager");

/* Base Class For the Crud Routes Of DbObject PaymentMethod */
class PaymentMethodManager extends PaymentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "paymentMethod";
    this.modelName = "PaymentMethod";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = PaymentMethodManager;
