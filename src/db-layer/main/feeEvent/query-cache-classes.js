const { QueryCache, QueryCacheInvalidator } = require("common");

class FeeEventQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("feeEvent", [], "$and", "$eq", input, wClause);
  }
}
class FeeEventQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("feeEvent", []);
  }
}

module.exports = {
  FeeEventQueryCache,
  FeeEventQueryCacheInvalidator,
};
