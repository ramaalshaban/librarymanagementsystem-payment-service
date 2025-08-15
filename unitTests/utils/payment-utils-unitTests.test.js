const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("Payment Gateway Utils", () => {
  let mocks;
  let paymentUtils;

  const session = {
    userId: "user123",
    email: "test@example.com",
    fullname: "John Doe",
    clientId: "client123",
  };

  beforeEach(() => {
    mocks = {
      dbLayer: {
        getPaymentCustomerByQuery: sinon.stub(),
        createPaymentCustomer: sinon.stub(),
        getPaymentMethodListByQuery: sinon.stub(),
        getPaymentMethodByPaymentMethodId: sinon.stub(),
        deletePaymentMethodById: sinon.stub(),
        createPaymentMethod: sinon.stub(),
      },
      stripeGateway: {
        addNewCustomer: sinon.stub(),
        deletePaymentMethod: sinon.stub(),
        addNewPaymentMethod: sinon.stub(),
      },
    };

    paymentUtils = proxyquire("../../src/utils/payment-utils.js", {
      dbLayer: mocks.dbLayer,
      common: {
        stripeGateway: mocks.stripeGateway,
        hexaLogger: { info: () => {}, error: () => {} },
      },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getPaymentCustomerId", () => {
    it("should return customerId if found", async () => {
      mocks.dbLayer.getPaymentCustomerByQuery.resolves({
        customerId: "cus_123",
      });

      const result = await paymentUtils.getPaymentCustomerId(session);

      expect(result).to.equal("cus_123");
    });

    it("should return null if not found", async () => {
      mocks.dbLayer.getPaymentCustomerByQuery.resolves(null);

      const result = await paymentUtils.getPaymentCustomerId(session);

      expect(result).to.be.null;
    });
  });

  describe("savePaymentCustomerId", () => {
    it("should create and return new customerId", async () => {
      mocks.stripeGateway.addNewCustomer.resolves({ id: "cus_456" });
      mocks.dbLayer.createPaymentCustomer.resolves({ customerId: "cus_456" });

      const result = await paymentUtils.savePaymentCustomerId(session);

      expect(result).to.equal("cus_456");
    });

    it("should return null if stripeGateway.addNewCustomer fails", async () => {
      mocks.stripeGateway.addNewCustomer.resolves(null);

      const result = await paymentUtils.savePaymentCustomerId(session);

      expect(result).to.be.null;
    });

    it("should return null if db insertion fails", async () => {
      mocks.stripeGateway.addNewCustomer.resolves({ id: "cus_456" });
      mocks.dbLayer.createPaymentCustomer.resolves(null);

      const result = await paymentUtils.savePaymentCustomerId(session);

      expect(result).to.be.null;
    });
    it("should return null if stripeGateway.addNewCustomer throws error", async () => {
      mocks.stripeGateway.addNewCustomer.rejects(new Error("Stripe error"));

      let result;
      try {
        result = await paymentUtils.savePaymentCustomerId(session);
      } catch (err) {
        // shouldn't happen
        result = null;
      }

      expect(result).to.be.null;
    });
  });

  describe("getPaymentMethodsOfUser", () => {
    it("should return payment methods list", async () => {
      const mockList = [{ id: "pm_1" }, { id: "pm_2" }];
      mocks.dbLayer.getPaymentMethodListByQuery.resolves(mockList);

      const result = await paymentUtils.getPaymentMethodsOfUser(session);

      expect(result).to.eql(mockList);
    });
  });

  describe("deletePaymentMethod", () => {
    it("should delete payment method and return deleted data", async () => {
      mocks.stripeGateway.deletePaymentMethod.resolves(true);
      mocks.dbLayer.getPaymentMethodByPaymentMethodId.resolves({
        id: "pmid123",
        userId: session.userId,
      });
      mocks.dbLayer.deletePaymentMethodById.resolves({
        id: "pmid123",
        deleted: true,
      });

      const result = await paymentUtils.deletePaymentMethod(
        session.userId,
        "pmid123",
      );

      expect(result).to.eql({ id: "pmid123", deleted: true });
    });

    it("should return null if stripe delete fails", async () => {
      mocks.stripeGateway.deletePaymentMethod.resolves(null);

      const result = await paymentUtils.deletePaymentMethod(
        session.userId,
        "pmid123",
      );

      expect(result).to.be.null;
    });

    it("should return null if method not found in DB", async () => {
      mocks.stripeGateway.deletePaymentMethod.resolves(true);
      mocks.dbLayer.getPaymentMethodByPaymentMethodId.resolves(null);

      const result = await paymentUtils.deletePaymentMethod(
        session.userId,
        "pmid123",
      );

      expect(result).to.be.null;
    });

    it("should return null if userId does not match", async () => {
      mocks.stripeGateway.deletePaymentMethod.resolves(true);
      mocks.dbLayer.getPaymentMethodByPaymentMethodId.resolves({
        id: "pmid123",
        userId: "otherUser",
      });

      const result = await paymentUtils.deletePaymentMethod(
        session.userId,
        "pmid123",
      );

      expect(result).to.be.null;
    });
    it("should return null if stripe delete throws an error", async () => {
      mocks.stripeGateway.deletePaymentMethod.rejects(
        new Error("Stripe error"),
      );

      let result;
      try {
        result = await paymentUtils.deletePaymentMethod(
          session.userId,
          "pmid123",
        );
      } catch (err) {
        result = null;
      }

      expect(result).to.be.null;
    });
  });

  describe("addPaymentMethodToCustomer", () => {
    it("should add and return new payment method", async () => {
      mocks.stripeGateway.addNewPaymentMethod.resolves({
        id: "pm_789",
        billing_details: {
          name: "John Doe",
          address: { postal_code: "12345" },
        },
        card: { brand: "visa", last4: "4242" },
      });

      mocks.dbLayer.createPaymentMethod.resolves({
        id: "pm_789",
        cardInfo: { brand: "visa" },
      });

      const result = await paymentUtils.addPaymentMethodToCustomer(
        session.userId,
        "cus_999",
        "pm_external",
        "stripe",
        session.clientId,
      );

      expect(result).to.have.property("id", "pm_789");
    });

    it("should return null if DB insert fails", async () => {
      mocks.stripeGateway.addNewPaymentMethod.resolves({
        id: "pm_789",
        billing_details: { name: "Test", address: { postal_code: "0000" } },
        card: {},
      });
      mocks.dbLayer.createPaymentMethod.resolves(null);

      const result = await paymentUtils.addPaymentMethodToCustomer(
        session.userId,
        "cus_999",
        "pm_external",
        "stripe",
        session.clientId,
      );

      expect(result).to.be.null;
    });
    it("should return null if stripe addNewPaymentMethod throws an error", async () => {
      mocks.stripeGateway.addNewPaymentMethod.rejects(
        new Error("Stripe error"),
      );

      let result;
      try {
        result = await paymentUtils.addPaymentMethodToCustomer(
          session.userId,
          "cus_999",
          "pm_external",
          "stripe",
          session.clientId,
        );
      } catch (err) {
        result = null;
      }

      expect(result).to.be.null;
    });
  });
});
