const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("FeeCheckout", () => {
  let FeeCheckout;
  let getStub, createStub, updateStub;
  let manager;

  const mockSession = { _USERID: "user-123" };

  beforeEach(() => {
    getStub = sinon.stub();
    createStub = sinon.stub();
    updateStub = sinon.stub();

    FeeCheckout = proxyquire(
      "../../../src/manager-layer/checkout/Fee-checkout",
      {
        dbLayer: {
          getFeePaymentByOrderId: getStub,
          createFeePayment: createStub,
          updateFeePaymentById: updateStub,
        },
        "./CheckoutManager": class {
          constructor(name, apiManager) {
            this.name = name;
            this.apiManager = apiManager;
            this.session = apiManager.session;
          }
        },
      },
    );

    manager = new FeeCheckout("test", {
      session: mockSession,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getPaymentTicket", () => {
    it("should return ticket when found", async () => {
      const orderId = "order123";
      const fakeResult = { id: "ticket-001" };
      getStub.resolves(fakeResult);

      const result = await manager.getPaymentTicket(orderId);

      expect(getStub.calledOnceWithExactly(orderId)).to.be.true;
      expect(result).to.equal(fakeResult);
    });
    it("should return null if no ticket found", async () => {
      getStub.resolves(null);
      const result = await manager.getPaymentTicket("missing-order");
      expect(result).to.be.null;
    });
  });

  describe("upsertPaymentTicket", () => {
    it("should call updateFeePaymentById if ticketId is provided", async () => {
      const ticketId = "ticket001";
      const orderId = "order123";
      const paymentId = "pay_001";
      const paymentStatus = "pending";
      const statusLiteral = "initiated";
      const redirectUrl = "http://redirect";
      const fakeResult = { id: "ticket001" };

      updateStub.resolves(fakeResult);

      const result = await manager.upsertPaymentTicket(
        ticketId,
        orderId,
        paymentId,
        paymentStatus,
        statusLiteral,
        redirectUrl,
      );

      expect(
        updateStub.calledOnceWithExactly(ticketId, {
          paymentId,
          paymentStatus,
          statusLiteral,
          redirectUrl,
        }),
      ).to.be.true;

      expect(result).to.equal(fakeResult);
    });

    it("should call createFeePayment if ticketId is not provided", async () => {
      const ticketId = null;
      const orderId = "order123";
      const paymentId = "pay_001";
      const paymentStatus = "pending";
      const statusLiteral = "initiated";
      const redirectUrl = "http://redirect";
      const fakeResult = { id: "ticket999" };

      createStub.resolves(fakeResult);

      const result = await manager.upsertPaymentTicket(
        ticketId,
        orderId,
        paymentId,
        paymentStatus,
        statusLiteral,
        redirectUrl,
      );

      expect(
        createStub.calledOnceWithExactly({
          ownerId: "user-123",
          orderId,
          paymentId,
          paymentStatus,
          statusLiteral,
          redirectUrl,
        }),
      ).to.be.true;

      expect(result).to.equal(fakeResult);
    });
    it("should handle null session safely when creating ticket", async () => {
      const BrokenCheckout = proxyquire(
        "../../../src/manager-layer/checkout/Fee-checkout",
        {
          dbLayer: {
            getFeePaymentByOrderId: getStub,
            createFeePayment: createStub,
            updateFeePaymentById: updateStub,
          },
          "./CheckoutManager": class {
            constructor(name, apiManager) {
              this.name = name;
              this.apiManager = apiManager;
              this.session = null; // no session
            }
          },
        },
      );

      const manager = new BrokenCheckout("test", { session: null });

      createStub.resolves({ id: "fallback-ticket" });

      const result = await manager.upsertPaymentTicket(
        null,
        "order123",
        "pay001",
        "pending",
        "initiated",
        "http://redirect",
      );

      expect(createStub.calledOnce).to.be.true;
      expect(result.id).to.equal("fallback-ticket");
    });
  });
});
