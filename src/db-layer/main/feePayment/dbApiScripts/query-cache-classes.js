const { QueryCache, QueryCacheInvalidator } = require("common");

class FeePaymentQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("feePayment", [], "$and", "$eq", input, wClause);
  }
}
class FeePaymentQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("feePayment", []);
  }
}

module.exports = {
  FeePaymentQueryCache,
  FeePaymentQueryCacheInvalidator,
};
