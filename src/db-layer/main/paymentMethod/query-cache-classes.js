const { QueryCache, QueryCacheInvalidator } = require("common");

class PaymentMethodQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("paymentMethod", [], "$and", "$eq", input, wClause);
  }
}
class PaymentMethodQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("paymentMethod", []);
  }
}

module.exports = {
  PaymentMethodQueryCache,
  PaymentMethodQueryCacheInvalidator,
};
