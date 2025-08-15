const { GetPaymentByOrderIdManager } = require("managers");
const { z } = require("zod");

const PaymentMcpController = require("../../PaymentServiceMcpController");

class GetPaymentByOrderIdMcpController extends PaymentMcpController {
  constructor(params) {
    super("getPaymentByOrderId", "getpaymentbyorderid", params);
    this.dataName = "feePayment";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetPaymentByOrderIdManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        feePayment: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            ownerId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                " An ID value to represent owner user who created the order",
              ),
            orderId: z
              .string()
              .uuid()
              .describe(
                "an ID value to represent the orderId which is the ID parameter of the source fee object",
              ),
            paymentId: z
              .string()
              .max(255)
              .describe(
                "A String value to represent the paymentId which is generated on the Stripe gateway. This id may represent different objects due to the payment gateway and the chosen flow type",
              ),
            paymentStatus: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the payment status which belongs to the lifecyle of a Stripe payment.",
              ),
            statusLiteral: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the logical payment status which belongs to the application lifecycle itself.",
              ),
            redirectUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "A string value to represent return page of the frontend to show the result of the payment, this is used when the callback is made to server not the client.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A payment storage object to store the payment life cyle of orders based on fee object. It is autocreated based on the source object's checkout config",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      feePaymentId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that is queried",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "getPaymentByOrderId",
    description: "",
    parameters: GetPaymentByOrderIdMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getPaymentByOrderIdMcpController =
        new GetPaymentByOrderIdMcpController(mcpParams);
      try {
        const result = await getPaymentByOrderIdMcpController.processRequest();
        //return GetPaymentByOrderIdMcpController.getOutputSchema().parse(result);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};
