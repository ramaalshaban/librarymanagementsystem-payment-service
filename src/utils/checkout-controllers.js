const { paymentGatePool } = require("common");
const fs = require("fs");
const path = require("path");
const {
  getPaymentCustomerId,
  savePaymentCustomerId,
  getPaymentMethodsOfUser,
  addPaymentMethodToCustomer,
  deletePaymentMethod,
} = require("./payment-utils");

const { dbGetFeePaymentByPaymentId } = require("dbLayer");

const getFeeController = async (req, res, next) => {
  const { getFeeById } = require("dbLayer");
  try {
    const orderId = req.query["orderId"];
    const fData = await getFeeById(orderId);
    const ownerId = await fData.userId;

    if (ownerId != req.session.userId) {
      res.status(403).send("Unauthorized");
      return;
    }

    res.send(fData);
  } catch (err) {
    console.log("Unmanaged err in  of fee flow demo => ", err.message);
    res.send({
      error: "Unmanaged err in  fee get order in flow demo => ",
      message: err.message,
    });
  }
};

const createFeeController = async (req, res, next) => {
  const { createFee } = require("dbLayer");
  try {
    if (!req.session?.userId) {
      res.status(403).send("Unauthorized");
      return;
    }
    const input = req.body;
    const fData = await createFee(input);
    res.send(fData);
  } catch (err) {
    console.log("Unmanaged err in createFee => ", err.message);
    res.send({ error: "Unmanaged err in createFee => ", message: err.message });
  }
};

const getFeeStripeDemoController = async (req, res, next) => {
  let fName = null;
  let userEmail = null;
  if (!req.session) {
    fName = path.join(
      __dirname,
      "../",
      "stripe-demo",
      "fee",
      "unauthorized.html",
    );
  } else {
    userEmail = req.session.email ?? "unknown";
    const url = req.url.split("?")[0];
    let fileName = url.split("/").pop();
    if (fileName == "fee" || fileName == "") fileName = "index.html";
    fName = path.join(__dirname, "../", "stripe-demo", "fee", fileName);
  }

  const serviceUrl = process.env.SERVICE_URL;
  let fData = fs.readFileSync(fName, "utf8");

  if (userEmail) fData = fData.replaceAll("$userEmail", userEmail);
  fData = fData.replaceAll("$serviceUrl", serviceUrl);
  fData = fData.replaceAll("$createOrderPath", "");
  const orderBody = {};
  fData = fData.replaceAll(
    "$createOrderBody",
    JSON.stringify(orderBody, null, 4),
  );
  res.send(fData);
};

const getPaymentMethodsController = async (req, res, next) => {
  try {
    if (!req.session) {
      res.status(403).send("Unauthorized");
      return;
    }

    let customerId = await getPaymentCustomerId(req.session, "stripe");

    if (!customerId) return res.send([]);

    const paymentMethods = await getPaymentMethodsOfUser(req.session, "stripe");
    res.send(paymentMethods);
  } catch (err) {
    console.log(err);
    console.log("Unmanaged err in getPaymentMethods => ", err.message);
    res.send({
      error: "Unmanaged err in getPaymentMethods => ",
      message: err.message,
    });
  }
};

const addPaymentMethodToCustomerController = async (req, res, next) => {
  try {
    if (!req.session) {
      res.status(403).send("Unauthorized");
      return;
    }

    const userId = req.session.userId;

    const paymentMethodId = req.body.paymentMethodId;
    let customerId = null;
    customerId = await getPaymentCustomerId(req.session, "stripe");
    if (!customerId) {
      customerId = await savePaymentCustomerId(req.session, "stripe");
    }
    const paymentMethod = await addPaymentMethodToCustomer(
      userId,
      customerId,
      paymentMethodId,
      "stripe",
    );
    res.send(paymentMethod);
  } catch (err) {
    console.log("Unmanaged err in addPaymentMethodToCustomer => ", err.message);
    res.send({
      error: "Unmanaged err in addPaymentMethodToCustomer => ",
      message: err.message,
    });
  }
};

const deletePaymentMethodController = async (req, res, next) => {
  try {
    if (!req.session) {
      res.status(403).send("Unauthorized");
      return;
    }

    const userId = req.session.userId;
    const paymentMethodId = req.params.paymentMethodId;
    const deletedData = await deletePaymentMethod(
      userId,
      paymentMethodId,
      "stripe",
    );
    res.send(deletedData);
  } catch (err) {
    console.log("Unmanaged err in deletePaymentMethod => ", err.message);
    res.send({
      error: "Unmanaged err in deletePaymentMethod => ",
      message: err.message,
    });
  }
};

module.exports = {
  getFeeController,
  createFeeController,
  getFeeStripeDemoController,
  getPaymentMethodsController,
  addPaymentMethodToCustomerController,
  deletePaymentMethodController,
};
