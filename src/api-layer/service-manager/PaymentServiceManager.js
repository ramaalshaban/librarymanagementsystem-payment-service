const ApiManager = require("./ApiManager");

class PaymentServiceManager extends ApiManager {
  constructor(request, options) {
    super(request, options);
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }
}

module.exports = PaymentServiceManager;
