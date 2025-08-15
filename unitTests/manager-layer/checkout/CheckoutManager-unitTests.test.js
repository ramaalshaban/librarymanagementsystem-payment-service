const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { stripeGateWay, HttpServerError } = require("common");

describe("CheckoutManager - clean stub style", () => {
  let manager, apiManagerMock, paymentGateMock;
  let ChekckoutManager;
  let getPaymentCustomerIdStub;

  beforeEach(() => {
    // dış fonksiyon stub
    getPaymentCustomerIdStub = sinon.stub().resolves("cust-123");

    // proxy ile inject edilmiş manager class
    ChekckoutManager = proxyquire(
      "../../../src/manager-layer/checkout/CheckoutManager",
      {
        common: {
          HttpServerError,
          stripeGateWay, // createPaymentGate kullanmayacağız
        },
        utils: {
          paymentUtils: {
            getPaymentCustomerId: getPaymentCustomerIdStub,
          },
        },
      },
    );

    const session = { userId: "user123" };

    apiManagerMock = {
      objectName: "order",
      modelName: "OrderModel",
      routeResourcePath: "/orders",
      session,
      getCheckoutParameters: sinon.stub(),
      getOrderId: sinon.stub().returns("order001"),
      checkoutUpdated: sinon.stub(),
    };

    manager = new ChekckoutManager("order", apiManagerMock);

    // paymentGateway manual olarak set ediliyor (start/complete/refresh)
    paymentGateMock = {
      startCheckout: sinon.stub(),
      completeCheckout: sinon.stub(),
      refreshCheckout: sinon.stub(),
    };
    manager.paymentGate = paymentGateMock;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPaymentGate", () => {
    it("should initialize and register webhook with correct path", async () => {
      const initStub = sinon.stub();
      const registerStub = sinon.stub();
      const mockStripeGate = {
        initPaymentGate: initStub,
        registerWebHook: registerStub,
      };

      // override global stripeGateWay just for this test
      const ChekckoutManagerWithStub = proxyquire(
        "../../../src/manager-layer/checkout/CheckoutManager",
        {
          common: {
            HttpServerError,
            stripeGateWay: mockStripeGate,
          },
          utils: {
            paymentUtils: {
              getPaymentCustomerId: getPaymentCustomerIdStub,
            },
          },
        },
      );

      const manager = new ChekckoutManagerWithStub("order", apiManagerMock);

      process.env.SERVICE_URL = "http://service";

      await manager.createPaymentGate();

      expect(initStub.calledOnce).to.be.true;
      expect(
        registerStub.calledOnceWith("http://service/checkout-webhook/order"),
      ).to.be.true;
    });
  });

  describe("startCheckout", () => {
    it("should return checkout result if no previous success ticket", async () => {
      const coParams = {
        orderId: "order001",
        redirectUrl: "http://redirect",
        amount: 1000,
        currency: "usd",
        description: "Order Desc",
        metadata: {},
      };

      apiManagerMock.getCheckoutParameters.returns(coParams);

      sinon.stub(manager, "getPaymentTicket").resolves(null);
      sinon.stub(manager, "upsertPaymentTicket").resolves({
        id: "ticket001",
        redirectUrl: "http://redirect",
      });

      paymentGateMock.startCheckout.resolves({
        paymentId: "pay_001",
        paymentStatus: "pending",
        paymentIntentInfo: {
          requires_redirect: true,
          redirectToUrl: "http://stripe",
        },
        statusLiteral: "initiated",
      });

      const result = await manager.startCheckout({
        return_url: "http://return",
      });

      expect(result).to.include({
        orderId: "order001",
        paymentId: "pay_001",
        paymentTicketId: "ticket001",
        success: true,
      });
    });

    it("should throw if checkout already completed", async () => {
      apiManagerMock.getCheckoutParameters.returns({ orderId: "order001" }); // ✅ FIX

      sinon
        .stub(manager, "getPaymentTicket")
        .resolves({ statusLiteral: "success" });

      try {
        await manager.startCheckout({});
        expect.fail("Expected HttpServerError");
      } catch (err) {
        expect(err).to.be.instanceOf(HttpServerError);
        expect(err.message).to.include("Checkout already completed");
      }
    });

    it("should upsert failed ticket and rethrow error if startCheckout fails", async () => {
      const coParams = { orderId: "order001", redirectUrl: "http://redirect" };
      apiManagerMock.getCheckoutParameters.returns(coParams);

      sinon.stub(manager, "getPaymentTicket").resolves(null);
      sinon
        .stub(manager, "upsertPaymentTicket")
        .resolves({ id: "fail_ticket" });

      paymentGateMock.startCheckout.rejects(new Error("stripe error"));

      try {
        await manager.startCheckout({});
        expect.fail("Expected error");
      } catch (err) {
        expect(err.message).to.equal("stripe error");
      }
    });
  });

  describe("completeCheckout", () => {
    it("should complete and return payment info", async () => {
      sinon.stub(manager, "getPaymentTicket").resolves({
        id: "ticket123",
        statusLiteral: "pending",
        paymentId: "pay_001",
        redirectUrl: "http://redirect",
      });

      sinon
        .stub(manager, "upsertPaymentTicket")
        .resolves({ id: "ticket123", redirectUrl: "http://redirect" });

      paymentGateMock.completeCheckout.resolves({
        paymentId: "pay_001",
        paymentStatus: "succeeded",
        paymentCompleteInfo: {},
        metadata: {},
        statusLiteral: "success",
      });

      const result = await manager.completeCheckout({});

      expect(result).to.include({
        paymentId: "pay_001",
        paymentTicketId: "ticket123",
        success: true,
        redirectUrl: "http://redirect",
      });
    });

    it("should throw if payment already completed", async () => {
      sinon
        .stub(manager, "getPaymentTicket")
        .resolves({ statusLiteral: "success" });

      try {
        await manager.completeCheckout({});
        expect.fail("Expected error");
      } catch (err) {
        expect(err).to.be.instanceOf(HttpServerError);
        expect(err.message).to.include("Checkout already completed");
      }
    });

    it("should throw if ticket not found", async () => {
      sinon.stub(manager, "getPaymentTicket").resolves(null);

      try {
        await manager.completeCheckout({});
        expect.fail("Expected error");
      } catch (err) {
        expect(err).to.be.instanceOf(HttpServerError);
        expect(err.message).to.include("Checkout didnt started");
      }
    });
  });

  describe("refreshCheckout", () => {
    it("should refresh and return info", async () => {
      const coParams = { orderId: "order001" };
      apiManagerMock.getCheckoutParameters.returns(coParams);

      sinon.stub(manager, "getPaymentTicket").resolves({
        id: "ticket123",
        paymentId: "pay_001",
      });

      sinon.stub(manager, "upsertPaymentTicket").resolves({ id: "ticket123" });

      paymentGateMock.refreshCheckout.resolves({
        paymentId: "pay_001",
        paymentStatus: "pending",
        paymentRefreshInfo: {},
        metadata: {},
        statusLiteral: "refreshed",
      });

      const result = await manager.refreshCheckout({});
      expect(result.statusLiteral).to.equal("refreshed");
      expect(result.success).to.be.true;
    });

    it("should throw if ticket is missing", async () => {
      apiManagerMock.getCheckoutParameters.returns({ orderId: "order001" });

      sinon.stub(manager, "getPaymentTicket").resolves(null);

      try {
        await manager.refreshCheckout({});
        expect.fail("Expected error");
      } catch (err) {
        expect(err).to.be.instanceOf(HttpServerError);
        expect(err.message).to.include("Checkout didnt started");
      }
    });
  });

  describe("processCheckoutCallbackResult", () => {
    it("should skip update if already success", async () => {
      const params = {
        statusLiteral: "success",
        orderId: "order001",
        paymentId: "pay_001",
        paymentStatus: "succeeded",
      };

      sinon.stub(manager, "getPaymentTicket").resolves({
        id: "ticket123",
        statusLiteral: "success",
      });

      const result = await manager.processCheckoutCallbackResult(params);
      expect(result.noUpdate).to.be.true;
    });

    it("should update ticket if status differs", async () => {
      const params = {
        statusLiteral: "success",
        orderId: "order001",
        paymentId: "pay_001",
        paymentStatus: "succeeded",
      };

      sinon.stub(manager, "getPaymentTicket").resolves({
        id: "ticket123",
        statusLiteral: "pending",
      });

      sinon.stub(manager, "upsertPaymentTicket").resolves({ id: "ticket123" });

      const result = await manager.processCheckoutCallbackResult(params);
      expect(result.statusLiteral).to.equal("success");
      expect(result.paymentId).to.equal("pay_001");
    });
  });
});
