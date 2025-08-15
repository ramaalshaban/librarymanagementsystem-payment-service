const { QueryCache, QueryCacheInvalidator } = require("common");

class PaymentCustomerQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("paymentCustomer", [], "$and", "$eq", input, wClause);
  }
}
class PaymentCustomerQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("paymentCustomer", []);
  }
}

module.exports = {
  PaymentCustomerQueryCache,
  PaymentCustomerQueryCacheInvalidator,
};
