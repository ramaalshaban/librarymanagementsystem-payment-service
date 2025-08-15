const { ServicePublisher } = require("serviceCommon");

// Fee Event Publisher Classes

// Publisher class for createFee route
const { FeeCreatedTopic } = require("./topics");
class FeeCreatedPublisher extends ServicePublisher {
  constructor(fee, session, requestId) {
    super(FeeCreatedTopic, fee, session, requestId);
  }

  static async Publish(fee, session, requestId) {
    const _publisher = new FeeCreatedPublisher(fee, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updateFee route
const { FeeUpdatedTopic } = require("./topics");
class FeeUpdatedPublisher extends ServicePublisher {
  constructor(fee, session, requestId) {
    super(FeeUpdatedTopic, fee, session, requestId);
  }

  static async Publish(fee, session, requestId) {
    const _publisher = new FeeUpdatedPublisher(fee, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for checkoutstartFee route
const { FeeCheckoutstartkedTopic } = require("./topics");
class FeeCheckoutstartkedPublisher extends ServicePublisher {
  constructor(fee, session, requestId) {
    super(FeeCheckoutstartkedTopic, fee, session, requestId);
  }

  static async Publish(fee, session, requestId) {
    const _publisher = new FeeCheckoutstartkedPublisher(
      fee,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for checkoutcompleteFee route
const { FeeCheckoutcompletedTopic } = require("./topics");
class FeeCheckoutcompletedPublisher extends ServicePublisher {
  constructor(fee, session, requestId) {
    super(FeeCheckoutcompletedTopic, fee, session, requestId);
  }

  static async Publish(fee, session, requestId) {
    const _publisher = new FeeCheckoutcompletedPublisher(
      fee,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for checkoutrefreshFee route
const { FeeCheckoutrefreshkedTopic } = require("./topics");
class FeeCheckoutrefreshkedPublisher extends ServicePublisher {
  constructor(fee, session, requestId) {
    super(FeeCheckoutrefreshkedTopic, fee, session, requestId);
  }

  static async Publish(fee, session, requestId) {
    const _publisher = new FeeCheckoutrefreshkedPublisher(
      fee,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// FeePayment Event Publisher Classes

// Publisher class for createFeePayment route
const { FeepaymentCreatedTopic } = require("./topics");
class FeepaymentCreatedPublisher extends ServicePublisher {
  constructor(feepayment, session, requestId) {
    super(FeepaymentCreatedTopic, feepayment, session, requestId);
  }

  static async Publish(feepayment, session, requestId) {
    const _publisher = new FeepaymentCreatedPublisher(
      feepayment,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateFeePayment route
const { FeepaymentUpdatedTopic } = require("./topics");
class FeepaymentUpdatedPublisher extends ServicePublisher {
  constructor(feepayment, session, requestId) {
    super(FeepaymentUpdatedTopic, feepayment, session, requestId);
  }

  static async Publish(feepayment, session, requestId) {
    const _publisher = new FeepaymentUpdatedPublisher(
      feepayment,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// FeeEvent Event Publisher Classes

// Publisher class for createFeeEvent route
const { FeeeventCreatedTopic } = require("./topics");
class FeeeventCreatedPublisher extends ServicePublisher {
  constructor(feeevent, session, requestId) {
    super(FeeeventCreatedTopic, feeevent, session, requestId);
  }

  static async Publish(feeevent, session, requestId) {
    const _publisher = new FeeeventCreatedPublisher(
      feeevent,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateFeeEvent route
const { FeeeventUpdatedTopic } = require("./topics");
class FeeeventUpdatedPublisher extends ServicePublisher {
  constructor(feeevent, session, requestId) {
    super(FeeeventUpdatedTopic, feeevent, session, requestId);
  }

  static async Publish(feeevent, session, requestId) {
    const _publisher = new FeeeventUpdatedPublisher(
      feeevent,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// FeePayment Event Publisher Classes

// Publisher class for getPayment route
const { PaymentRetrivedTopic } = require("./topics");
class PaymentRetrivedPublisher extends ServicePublisher {
  constructor(payment, session, requestId) {
    super(PaymentRetrivedTopic, payment, session, requestId);
  }

  static async Publish(payment, session, requestId) {
    const _publisher = new PaymentRetrivedPublisher(
      payment,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for getPaymentByOrderId route
const { PaymentbyorderidRetrivedTopic } = require("./topics");
class PaymentbyorderidRetrivedPublisher extends ServicePublisher {
  constructor(paymentbyorderid, session, requestId) {
    super(PaymentbyorderidRetrivedTopic, paymentbyorderid, session, requestId);
  }

  static async Publish(paymentbyorderid, session, requestId) {
    const _publisher = new PaymentbyorderidRetrivedPublisher(
      paymentbyorderid,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for getPaymentByPaymentId route
const { PaymentbypaymentidRetrivedTopic } = require("./topics");
class PaymentbypaymentidRetrivedPublisher extends ServicePublisher {
  constructor(paymentbypaymentid, session, requestId) {
    super(
      PaymentbypaymentidRetrivedTopic,
      paymentbypaymentid,
      session,
      requestId,
    );
  }

  static async Publish(paymentbypaymentid, session, requestId) {
    const _publisher = new PaymentbypaymentidRetrivedPublisher(
      paymentbypaymentid,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for createPayment route
const { PaymentCreatedTopic } = require("./topics");
class PaymentCreatedPublisher extends ServicePublisher {
  constructor(payment, session, requestId) {
    super(PaymentCreatedTopic, payment, session, requestId);
  }

  static async Publish(payment, session, requestId) {
    const _publisher = new PaymentCreatedPublisher(payment, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updatePayment route
const { PaymentUpdatedTopic } = require("./topics");
class PaymentUpdatedPublisher extends ServicePublisher {
  constructor(payment, session, requestId) {
    super(PaymentUpdatedTopic, payment, session, requestId);
  }

  static async Publish(payment, session, requestId) {
    const _publisher = new PaymentUpdatedPublisher(payment, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for listPayments route
const { PaymentsListedTopic } = require("./topics");
class PaymentsListedPublisher extends ServicePublisher {
  constructor(payments, session, requestId) {
    super(PaymentsListedTopic, payments, session, requestId);
  }

  static async Publish(payments, session, requestId) {
    const _publisher = new PaymentsListedPublisher(
      payments,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deletePayment route
const { PaymentDeletedTopic } = require("./topics");
class PaymentDeletedPublisher extends ServicePublisher {
  constructor(payment, session, requestId) {
    super(PaymentDeletedTopic, payment, session, requestId);
  }

  static async Publish(payment, session, requestId) {
    const _publisher = new PaymentDeletedPublisher(payment, session, requestId);
    await _publisher.publish();
  }
}

// PaymentCustomer Event Publisher Classes

// Publisher class for getCustomerByUserId route
const { CustomerbyuseridRetrivedTopic } = require("./topics");
class CustomerbyuseridRetrivedPublisher extends ServicePublisher {
  constructor(customerbyuserid, session, requestId) {
    super(CustomerbyuseridRetrivedTopic, customerbyuserid, session, requestId);
  }

  static async Publish(customerbyuserid, session, requestId) {
    const _publisher = new CustomerbyuseridRetrivedPublisher(
      customerbyuserid,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for listCustomers route
const { CustomersListedTopic } = require("./topics");
class CustomersListedPublisher extends ServicePublisher {
  constructor(customers, session, requestId) {
    super(CustomersListedTopic, customers, session, requestId);
  }

  static async Publish(customers, session, requestId) {
    const _publisher = new CustomersListedPublisher(
      customers,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// PaymentMethod Event Publisher Classes

// Publisher class for listethods route
const { ListethodsDoneTopic } = require("./topics");
class ListethodsDonePublisher extends ServicePublisher {
  constructor(listethods, session, requestId) {
    super(ListethodsDoneTopic, listethods, session, requestId);
  }

  static async Publish(listethods, session, requestId) {
    const _publisher = new ListethodsDonePublisher(
      listethods,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

module.exports = {
  FeeCreatedPublisher,
  FeeUpdatedPublisher,
  FeeCheckoutstartkedPublisher,
  FeeCheckoutcompletedPublisher,
  FeeCheckoutrefreshkedPublisher,
  FeepaymentCreatedPublisher,
  FeepaymentUpdatedPublisher,
  FeeeventCreatedPublisher,
  FeeeventUpdatedPublisher,
  PaymentRetrivedPublisher,
  PaymentbyorderidRetrivedPublisher,
  PaymentbypaymentidRetrivedPublisher,
  PaymentCreatedPublisher,
  PaymentUpdatedPublisher,
  PaymentsListedPublisher,
  PaymentDeletedPublisher,
  CustomerbyuseridRetrivedPublisher,
  CustomersListedPublisher,
  ListethodsDonePublisher,
};
