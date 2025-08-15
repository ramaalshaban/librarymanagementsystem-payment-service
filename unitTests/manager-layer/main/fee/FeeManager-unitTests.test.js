const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("FeeManager", () => {
  let ManagerClass;
  let manager;
  let req;

  beforeEach(() => {
    req = {
      session: {
        _USERID: "u1",
        fullname: "Test User",
        name: "Test",
        surname: "User",
        email: "test@example.com",
      },
    };
    ManagerClass = proxyquire(
      "../../../../src/manager-layer/main/Fee/FeeManager",
      {
        "../../service-manager/PaymentServiceManager": class {
          constructor() {
            this.session = req.session;
            this.bodyParams = {};
          }
          toJSON() {
            return {};
          }
        },
      },
    );
    manager = new ManagerClass(req);
  });

  describe("constructor", () => {
    it("should initialize properties correctly", () => {
      const ManagerClass = proxyquire(
        "../../../../src/manager-layer/main/Fee/FeeManager",
        {
          "../../service-manager/PaymentServiceManager": class {
            constructor(request, options) {
              this.session = request.session;
              this.bodyParams = {};
            }
          },
        },
      );

      const req = {
        session: {
          _USERID: "u1",
          fullname: "Test User",
          name: "Test",
          surname: "User",
          email: "test@example.com",
        },
      };

      const instance = new ManagerClass(req);
      expect(instance).to.have.property("objectName", "fee");
      expect(instance).to.have.property("modelName", "Fee");
      expect(instance.session).to.equal(req.session);
    });
  });

  describe("checkoutUpdated", () => {
    beforeEach(() => {
      manager.checkoutStarted = sinon.stub();
      manager.checkoutCanceled = sinon.stub();
      manager.checkoutFailed = sinon.stub();
      manager.checkoutDone = sinon.stub();
    });

    it("should call checkoutStarted for 'started'", async () => {
      await manager.checkoutUpdated("started");
      sinon.assert.calledOnce(manager.checkoutStarted);
    });

    it("should call checkoutCanceled for 'canceled'", async () => {
      await manager.checkoutUpdated("canceled");
      sinon.assert.calledOnce(manager.checkoutCanceled);
    });

    it("should call checkoutFailed for 'failed'", async () => {
      await manager.checkoutUpdated("failed");
      sinon.assert.calledOnce(manager.checkoutFailed);
    });

    it("should call checkoutDone for 'success'", async () => {
      await manager.checkoutUpdated("success");
      sinon.assert.calledOnce(manager.checkoutDone);
    });

    it("should call checkoutFailed for unknown status", async () => {
      await manager.checkoutUpdated("unknown");
      sinon.assert.calledOnce(manager.checkoutFailed);
    });
  });

  describe("getCheckoutParameters", () => {
    it("should return valid checkout parameter object", () => {
      const userParams = { storeCard: true };

      manager.fee = { id: "order-789", price: 49.99 };

      const params = manager.getCheckoutParameters(userParams);
      expect(params.userId).to.equal("u1");
      expect(params.email).to.equal("test@example.com");
      expect(params.storeCard).to.be.true;
      expect(params.amount).to.equal(49.99);
      expect(params.currency).to.equal("USD");
      expect(params.orderId).to.equal("order-789");
    });
  });
});
