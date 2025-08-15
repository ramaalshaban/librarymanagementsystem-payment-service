const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "librarymanagementsystem - payment",
    brand: {
      name: "librarymanagementsystem",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "payment",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "Fee",
        description:
          "Represents an individual overdue/lost/damage library fee charged to a member. Serves as order object for Stripe integration and staff/manual payment. Tracks who owes the fee, status, payment tracking, amount, reason, and related lending record.",
        reference: {
          tableName: "fee",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "loanId",
              type: "ID",
            },

            {
              name: "amount",
              type: "Double",
            },

            {
              name: "currency",
              type: "String",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "statusUpdateDate",
              type: "Date",
            },

            {
              name: "reason",
              type: "String",
            },

            {
              name: "note",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/fees/{feeId}",
            title: "getFee",
            query: [],

            parameters: [
              {
                key: "feeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/fees",
            title: "createFee",
            query: [],

            body: {
              type: "json",
              content: {
                userId: "ID",
                loanId: "ID",
                amount: "Double",
                currency: "String",
                status: "Enum",
                statusUpdateDate: "Date",
                reason: "String",
                note: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/fees/{feeId}",
            title: "updateFee",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                statusUpdateDate: "Date",
                note: "Text",
              },
            },

            parameters: [
              {
                key: "feeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/fees/{feeId}",
            title: "deleteFee",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/fees",
            title: "listFees",
            query: [],

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/startcheckout/fee/{feeId}",
            title: "checkoutstartFee",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/completecheckout/fee/{feeId}",
            title: "checkoutcompleteFee",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/refreshcheckout/fee/{feeId}",
            title: "checkoutrefreshFee",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },
        ],
      },

      {
        name: "FeePayment",
        description:
          "Tracks a fee payment attempt or transaction (Stripe or manual/staff). Stores reference to the fee/order, payment method, status, timing, amount paid, Stripe transaction details, staff involvement when not online.",
        reference: {
          tableName: "feePayment",
          properties: [
            {
              name: "feeId",
              type: "ID",
            },

            {
              name: "amountPaid",
              type: "Double",
            },

            {
              name: "currency",
              type: "String",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "paymentMethod",
              type: "Enum",
            },

            {
              name: "paymentStatus",
              type: "Enum",
            },

            {
              name: "paymentDate",
              type: "Date",
            },

            {
              name: "stripePaymentIntentId",
              type: "String",
            },

            {
              name: "handledByUserId",
              type: "ID",
            },

            {
              name: "note",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/feepayments/{feePaymentId}",
            title: "getFeePayment",
            query: [],

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/feepayments",
            title: "createFeePayment",
            query: [],

            body: {
              type: "json",
              content: {
                feeId: "ID",
                amountPaid: "Double",
                currency: "String",
                userId: "ID",
                paymentMethod: "Enum",
                paymentStatus: "Enum",
                paymentDate: "Date",
                stripePaymentIntentId: "String",
                handledByUserId: "ID",
                note: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/feepayments/{feePaymentId}",
            title: "updateFeePayment",
            query: [],

            body: {
              type: "json",
              content: {
                paymentStatus: "Enum",
                paymentDate: "Date",
                note: "Text",
              },
            },

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/feepayments/{feePaymentId}",
            title: "deleteFeePayment",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/feepayments",
            title: "listFeePayments",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "FeeEvent",
        description:
          "Audit/event log for fee lifecycle: includes creation, payment attempts, waives, cancellations, and staff actions for compliance/audit purposes.",
        reference: {
          tableName: "feeEvent",
          properties: [
            {
              name: "feeId",
              type: "ID",
            },

            {
              name: "eventType",
              type: "Enum",
            },

            {
              name: "eventDate",
              type: "Date",
            },

            {
              name: "actorUserId",
              type: "ID",
            },

            {
              name: "note",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/feeevents/{feeEventId}",
            title: "getFeeEvent",
            query: [],

            parameters: [
              {
                key: "feeEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/feeevents",
            title: "createFeeEvent",
            query: [],

            body: {
              type: "json",
              content: {
                feeId: "ID",
                eventType: "Enum",
                eventDate: "Date",
                actorUserId: "ID",
                note: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/feeevents/{feeEventId}",
            title: "updateFeeEvent",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feeEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/feeevents/{feeEventId}",
            title: "deleteFeeEvent",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feeEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/feeevents",
            title: "listFeeEvents",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "FeePayment",
        description:
          "A payment storage object to store the payment life cyle of orders based on fee object. It is autocreated based on the source object&#39;s checkout config",
        reference: {
          tableName: "feePayment",
          properties: [
            {
              name: "ownerId",
              type: "ID",
            },

            {
              name: "orderId",
              type: "ID",
            },

            {
              name: "paymentId",
              type: "String",
            },

            {
              name: "paymentStatus",
              type: "String",
            },

            {
              name: "statusLiteral",
              type: "String",
            },

            {
              name: "redirectUrl",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/payment/{feePaymentId}",
            title: "getPayment",
            query: [],

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/paymentbyorderid/{feePaymentId}",
            title: "getPaymentByOrderId",
            query: [],

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/paymentbypaymentid/{feePaymentId}",
            title: "getPaymentByPaymentId",
            query: [],

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/payment",
            title: "createPayment",
            query: [],

            body: {
              type: "json",
              content: {
                orderId: "ID",
                paymentId: "String",
                paymentStatus: "String",
                statusLiteral: "String",
                redirectUrl: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/payment/{feePaymentId}",
            title: "updatePayment",
            query: [],

            body: {
              type: "json",
              content: {
                paymentId: "String",
                paymentStatus: "String",
                statusLiteral: "String",
                redirectUrl: "String",
              },
            },

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/payments",
            title: "listPayments",
            query: [],

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/payment/{feePaymentId}",
            title: "deletePayment",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "feePaymentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },
        ],
      },

      {
        name: "PaymentCustomer",
        description:
          "A payment storage object to store the customer values of the payment platform",
        reference: {
          tableName: "paymentCustomer",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "customerId",
              type: "String",
            },

            {
              name: "platform",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/paymentcustomers/{userId}",
            title: "getCustomerByUserId",
            query: [],

            parameters: [
              {
                key: "userId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/customers",
            title: "listCustomers",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "PaymentMethod",
        description:
          "A payment storage object to store the payment methods of the platform customers",
        reference: {
          tableName: "paymentMethod",
          properties: [
            {
              name: "paymentMethodId",
              type: "String",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "customerId",
              type: "String",
            },

            {
              name: "cardHolderName",
              type: "String",
            },

            {
              name: "cardHolderZip",
              type: "String",
            },

            {
              name: "platform",
              type: "String",
            },

            {
              name: "cardInfo",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/listethods",
            title: "listethods",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
