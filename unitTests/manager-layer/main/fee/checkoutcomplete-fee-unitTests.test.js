const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("CheckoutcompleteFee", () => {
  let ControllerClass;
  let req;

  beforeEach(() => {
    req = {
      inputData: {},
      body: {},
      query: {},
    };

    ControllerClass = proxyquire(
      "../../../../src/manager-layer/main/Fee/checkoutcomplete-fee",
      {
        "./FeeManager": class {
          constructor(request, options) {
            this.request = request;
            this.options = options;
            this.session = {
              _USERID: "u1",
              email: "a@b.com",
              fullname: "Test User",
            };
            this.bodyParams = {};
            this.readTenantId = sinon.stub();
          }
        },
      },
    );
  });

  it("should initialize controller with correct base properties", () => {
    const instance = new ControllerClass(req, "rest");
    expect(instance.options.name).to.equal("checkoutcompleteFee");
    expect(instance.options.controllerType).to.equal("rest");
    expect(instance.options.crudType).to.equal("update");
    expect(instance.dataName).to.equal("fee");
  });

  it("should assign paymentUserParams correctly", () => {
    req.body.paymentUserParams = { test: true };
    const instance = new ControllerClass(req, "rest");
    expect(instance.paymentUserParams).to.deep.equal({ test: true });
  });
});

//// Other tests will be added later
