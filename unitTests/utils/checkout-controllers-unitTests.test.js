const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("Checkout Controller", () => {
  let mocks, controllers;
  let req, res, next;

  beforeEach(() => {
    mocks = {
      dbLayer: {
        getFeeById: sinon.stub(),
        createFee: sinon.stub(),
        dbGetFeePaymentByPaymentId: sinon.stub(),
        getFeePaymentByPaymentId: sinon.stub().resolves({
          orderId: "order123",
          redirectUrl: "https://redirect.example.com",
        }),
        getFeePaymentByPaymentId: sinon.stub().resolves({
          orderId: "order123",
          redirectUrl: "https://redirect.example.com",
        }),
      },
      utils: {
        getPaymentCustomerId: sinon.stub(),
        savePaymentCustomerId: sinon.stub(),
        getPaymentMethodsOfUser: sinon.stub(),
        addPaymentMethodToCustomer: sinon.stub(),
        deletePaymentMethod: sinon.stub(),
      },
      fs: {
        readFileSync: sinon.stub(),
      },
      path: {
        join: sinon.stub(),
      },
      paymentGatePool: {
        demoModel: {
          webhookController: sinon.stub(),
          callbackController: sinon.stub(),
        },
      },
      restLayer: {
        getDemoModelController: sinon.stub().callsArgWith(2, null),
      },
    };

    req = {
      body: {},
      params: {},
      query: {},
      session: {},
      sessionObject: { userId: "user123" },
      headers: {},
    };

    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      redirect: sinon.stub(),
    };

    next = sinon.stub();

    controllers = proxyquire("../../src/utils/checkout-controllers.js", {
      "../../src/utils/payment-utils": mocks.utils,
      fs: mocks.fs,
      path: mocks.path,
      dbLayer: mocks.dbLayer,
      common: {
        paymentGatePool: mocks.paymentGatePool,
      },
      restLayer: mocks.restLayer,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getFeeController", () => {
    it("should return order if owner matches", async () => {
      req.query.orderId = "order123";
      mocks.dbLayer.getFeeById.resolves({ userId: "user123" });

      await controllers.getFeeController(req, res, next);
      expect(res.send.calledOnce).to.be.true;
    });

    it("should return 403 if owner does not match", async () => {
      req.query.orderId = "order123";
      mocks.dbLayer.getFeeById.resolves({ userId: "anotherUser" });

      await controllers.getFeeController(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
    });
    it("should handle error in getFeeController", async () => {
      req.query.orderId = "order123";
      mocks.dbLayer.getFeeById.rejects(new Error("db error"));

      await controllers.getFeeController(req, res, next);
      expect(res.send.calledOnce).to.be.true;
      const response = res.send.firstCall.args[0];
      expect(response).to.have.property("error");
      expect(response.message).to.include("db error");
    });
  });

  describe("createFeeController", () => {
    it("should return 403 if userId missing", async () => {
      req.sessionObject = null;
      await controllers.createFeeController(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it("should create order and return result", async () => {
      req.session = { userId: "user123" };
      req.body = { package: "basic" };
      mocks.dbLayer.createFee.resolves({ id: "order456" });

      await controllers.createFeeController(req, res, next);
      expect(res.send.calledWith({ id: "order456" })).to.be.true;
    });
    it("should handle error in createFeeController", async () => {
      req.session = { userId: "user123" };
      req.body = { package: "basic" };
      mocks.dbLayer.createFee.rejects(new Error("create failed"));

      await controllers.createFeeController(req, res, next);
      expect(res.send.calledOnce).to.be.true;
      const response = res.send.firstCall.args[0];
      expect(response).to.have.property("error");
      expect(response.message).to.include("create failed");
    });
  });

  describe("getFeeStripeDemoController", () => {
    it("should return unauthorized html if no session", async () => {
      req.session = null;
      mocks.path.join.returns("unauthorized.html");
      mocks.fs.readFileSync.returns("<html>$clientId</html>");

      await controllers.getFeeStripeDemoController(req, res, next);
      expect(res.send.calledOnce).to.be.true;
    });

    it("should return filled HTML", async () => {
      req.session.email = "test@example.com";
      req.url = "/Fee";
      req.query.clientId = "abc123";
      process.env.SERVICE_URL = "https://example.com";
      mocks.path.join.returns("index.html");
      mocks.fs.readFileSync.returns(
        "<html>$clientId $userEmail $serviceUrl $createFeePath $createFeeBody</html>",
      );

      await controllers.getFeeStripeDemoController(req, res, next);
      const html = res.send.firstCall.args[0];
      expect(html).to.include("abc123");
      expect(html).to.include("test@example.com");
    });
  });

  describe("getPaymentMethodsController", () => {
    it("should return 403 if session missing", async () => {
      req.session = null;
      await controllers.getPaymentMethodsController(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it("should return [] if customer not found", async () => {
      mocks.utils.getPaymentCustomerId.resolves(null);
      await controllers.getPaymentMethodsController(req, res, next);
      expect(res.send.calledWith([])).to.be.true;
    });

    it("should return payment methods", async () => {
      mocks.utils.getPaymentCustomerId.resolves("cus_123");
      mocks.utils.getPaymentMethodsOfUser.resolves([{ id: "pm1" }]);
      await controllers.getPaymentMethodsController(req, res, next);
      expect(res.send.calledWith([{ id: "pm1" }])).to.be.true;
    });
  });

  describe("addPaymentMethodToCustomerController", () => {
    it("should return 403 if no session", async () => {
      req.session = null;
      await controllers.addPaymentMethodToCustomerController(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it("should save and return payment method", async () => {
      req.query.clientId = "cli";
      req.body.paymentMethodId = "pm_001";
      mocks.utils.getPaymentCustomerId.resolves(null);
      mocks.utils.savePaymentCustomerId.resolves("cus_123");
      mocks.utils.addPaymentMethodToCustomer.resolves({ id: "pm_001" });

      await controllers.addPaymentMethodToCustomerController(req, res, next);
      expect(res.send.calledWith({ id: "pm_001" })).to.be.true;
    });
  });

  describe("deletePaymentMethodController", () => {
    it("should return 403 if no session", async () => {
      req.session = null;
      await controllers.deletePaymentMethodController(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it("should delete and return result", async () => {
      req.params.paymentMethodId = "pm_del";
      mocks.utils.deletePaymentMethod.resolves({ deleted: true });

      await controllers.deletePaymentMethodController(req, res, next);
      expect(res.send.calledWith({ deleted: true })).to.be.true;
    });
  });
});
