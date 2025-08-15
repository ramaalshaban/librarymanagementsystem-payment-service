const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetFeeRestController also from file getfee.js
describe("GetFeeRestController", () => {
  let GetFeeRestController, getFee;
  let GetFeeManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetFeeManager constructor
    GetFeeManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetFeeRestController, getFee } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/fee/get-fee.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetFeeManager: GetFeeManagerStub,
        },
        "../../PaymentServiceRestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetFeeRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetFeeRestController(req, res, next);

      expect(controller.name).to.equal("getFee");
      expect(controller.routeName).to.equal("getfee");
      expect(controller.dataName).to.equal("fee");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetFeeManager in createApiManager()", () => {
      const controller = new GetFeeRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetFeeManagerStub.calledOnceWithExactly(req, "rest")).to.be.true;
    });
  });

  describe("getFee function", () => {
    it("should create instance and call processRequest", async () => {
      await getFee(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
