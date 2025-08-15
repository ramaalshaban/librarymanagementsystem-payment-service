const { getFeeById, getIdListOfFeeByField } = require("dbLayer");
const { getFeePaymentById, getIdListOfFeePaymentByField } = require("dbLayer");
const { getFeeEventById, getIdListOfFeeEventByField } = require("dbLayer");
const { getFeePaymentById, getIdListOfFeePaymentByField } = require("dbLayer");
const {
  getPaymentCustomerById,
  getIdListOfPaymentCustomerByField,
} = require("dbLayer");
const {
  getPaymentMethodById,
  getIdListOfPaymentMethodByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexFeeData = async () => {
  const feeIndexer = new ElasticIndexer("fee", { isSilent: true });
  console.log("Starting to update indexes for Fee");

  const idList = (await getIdListOfFeeByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getFeeById(chunk);
    if (dataList.length) {
      await feeIndexer.indexBulkData(dataList);
      await feeIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexFeePaymentData = async () => {
  const feePaymentIndexer = new ElasticIndexer("feePayment", {
    isSilent: true,
  });
  console.log("Starting to update indexes for FeePayment");

  const idList = (await getIdListOfFeePaymentByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getFeePaymentById(chunk);
    if (dataList.length) {
      await feePaymentIndexer.indexBulkData(dataList);
      await feePaymentIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexFeeEventData = async () => {
  const feeEventIndexer = new ElasticIndexer("feeEvent", { isSilent: true });
  console.log("Starting to update indexes for FeeEvent");

  const idList = (await getIdListOfFeeEventByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getFeeEventById(chunk);
    if (dataList.length) {
      await feeEventIndexer.indexBulkData(dataList);
      await feeEventIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexFeePaymentData = async () => {
  const feePaymentIndexer = new ElasticIndexer("feePayment", {
    isSilent: true,
  });
  console.log("Starting to update indexes for FeePayment");

  const idList = (await getIdListOfFeePaymentByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getFeePaymentById(chunk);
    if (dataList.length) {
      await feePaymentIndexer.indexBulkData(dataList);
      await feePaymentIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexPaymentCustomerData = async () => {
  const paymentCustomerIndexer = new ElasticIndexer("paymentCustomer", {
    isSilent: true,
  });
  console.log("Starting to update indexes for PaymentCustomer");

  const idList =
    (await getIdListOfPaymentCustomerByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPaymentCustomerById(chunk);
    if (dataList.length) {
      await paymentCustomerIndexer.indexBulkData(dataList);
      await paymentCustomerIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexPaymentMethodData = async () => {
  const paymentMethodIndexer = new ElasticIndexer("paymentMethod", {
    isSilent: true,
  });
  console.log("Starting to update indexes for PaymentMethod");

  const idList =
    (await getIdListOfPaymentMethodByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPaymentMethodById(chunk);
    if (dataList.length) {
      await paymentMethodIndexer.indexBulkData(dataList);
      await paymentMethodIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexFeeData();
    console.log("Fee agregated data is indexed, total fees:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Fee data", err.toString());
  }

  try {
    const dataCount = await indexFeePaymentData();
    console.log(
      "FeePayment agregated data is indexed, total feePayments:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing FeePayment data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexFeeEventData();
    console.log(
      "FeeEvent agregated data is indexed, total feeEvents:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing FeeEvent data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexFeePaymentData();
    console.log(
      "FeePayment agregated data is indexed, total feePayments:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing FeePayment data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexPaymentCustomerData();
    console.log(
      "PaymentCustomer agregated data is indexed, total paymentCustomers:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing PaymentCustomer data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexPaymentMethodData();
    console.log(
      "PaymentMethod agregated data is indexed, total paymentMethods:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing PaymentMethod data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
