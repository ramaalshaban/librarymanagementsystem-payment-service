// these functions are used to provide paymentgatway to link it with the payment customer storage

const { hexaLogger } = require("common");
const { getPaymentCustomerByQuery } = require("dbLayer");
const { createPaymentCustomer } = require("dbLayer");
const {
  createPaymentMethod,
  getPaymentMethodListByQuery,
  getPaymentMethodByPaymentMethodId,
  deletePaymentMethodById,
} = require("dbLayer");

const { stripeGateway } = require("common");

const getPaymentCustomerId = async (session, platform = "stripe") => {
  const userId = session.userId;

  const where = {
    userId: userId,
    platform: platform,
    isActive: true,
  };

  const paymentCustomer = await getPaymentCustomerByQuery(where);

  if (paymentCustomer) {
    return paymentCustomer.customerId;
  }
  return null;
};

const savePaymentCustomerId = async (session, platform = "stripe") => {
  const userId = session.userId;
  const email = session.email;
  const fullName = session.fullname;

  const customer = await stripeGateway.addNewCustomer(fullName, email, userId);

  if (!customer) {
    return null;
  }

  const input = {
    userId,
    customerId: customer.id,

    platform,
  };
  const paymentCustomer = await createPaymentCustomer(input);
  if (paymentCustomer) {
    return paymentCustomer.customerId;
  }
  return null;
};

const getPaymentMethodsOfUser = async (session, platform = "stripe") => {
  const userId = session.userId;
  const where = {
    userId: userId,
    platform: platform,
    isActive: true,
  };

  const paymentMethods = await getPaymentMethodListByQuery(where);
  return paymentMethods;
};

const deletePaymentMethod = async (
  userId,
  paymentMethodId,
  platform = "stripe",
) => {
  const paymentMethod =
    await stripeGateway.deletePaymentMethod(paymentMethodId);
  if (paymentMethod) {
    const paymentMethodData =
      await getPaymentMethodByPaymentMethodId(paymentMethodId);

    if (!paymentMethodData) {
      return null;
    }

    if (paymentMethodData.userId !== userId) {
      return null;
    }

    const deletedData = await deletePaymentMethodById(paymentMethodData.id);

    if (deletedData) {
      return deletedData;
    }
  }
  return null;
};

const addPaymentMethodToCustomer = async (
  userId,
  customerId,
  paymentMethodId,
  platform,
) => {
  const paymentMethod = await stripeGateway.addNewPaymentMethod(
    customerId,
    paymentMethodId,
  );

  const cardHolderName = paymentMethod.billing_details.name;
  const cardHolderZip = paymentMethod.billing_details.address.postal_code;

  const input = {
    cardHolderName,
    userId,
    customerId,
    paymentMethodId: paymentMethod.id,

    platform,
    cardHolderZip,
    cardInfo: paymentMethod.card,
  };
  const paymentMethodData = await createPaymentMethod(input);

  if (paymentMethodData) {
    return paymentMethodData;
  }
  return null;
};

module.exports = {
  getPaymentCustomerId,
  savePaymentCustomerId,
  getPaymentMethodsOfUser,
  addPaymentMethodToCustomer,
  deletePaymentMethod,
};
