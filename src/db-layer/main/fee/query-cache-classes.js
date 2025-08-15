const { QueryCache, QueryCacheInvalidator } = require("common");

class FeeQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("fee", [], "$and", "$eq", input, wClause);
  }
}
class FeeQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("fee", []);
  }
}

module.exports = {
  FeeQueryCache,
  FeeQueryCacheInvalidator,
};
