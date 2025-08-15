const { GetCustomerByUserIdManager } = require("managers");
const { z } = require("zod");

const PaymentMcpController = require("../../PaymentServiceMcpController");

class GetCustomerByUserIdMcpController extends PaymentMcpController {
  constructor(params) {
    super("getCustomerByUserId", "getcustomerbyuserid", params);
    this.dataName = "paymentCustomer";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetCustomerByUserIdManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        paymentCustomer: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                " An ID value to represent the user who is created as a stripe customer",
              ),
            customerId: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the customer id which is generated on the Stripe gateway. This id is used to represent the customer in the Stripe gateway",
              ),
            platform: z
              .string()
              .max(255)
              .describe(
                "A String value to represent payment platform which is used to make the payment. It is stripe as default. It will be used to distinguesh the payment gateways in the future.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A payment storage object to store the customer values of the payment platform",
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
      userId: z
        .string()
        .uuid()
        .describe(
          " An ID value to represent the user who is created as a stripe customer. The parameter is used to query data.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "getCustomerByUserId",
    description: "",
    parameters: GetCustomerByUserIdMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getCustomerByUserIdMcpController =
        new GetCustomerByUserIdMcpController(mcpParams);
      try {
        const result = await getCustomerByUserIdMcpController.processRequest();
        //return GetCustomerByUserIdMcpController.getOutputSchema().parse(result);
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
