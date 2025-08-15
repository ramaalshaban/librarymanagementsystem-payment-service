const { ListethodsManager } = require("managers");
const { z } = require("zod");

const PaymentMcpController = require("../../PaymentServiceMcpController");

class ListethodsMcpController extends PaymentMcpController {
  constructor(params) {
    super("listethods", "listethods", params);
    this.dataName = "paymentMethods";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListethodsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        paymentMethods: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            paymentMethodId: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the id of the payment method on the payment platform.",
              ),
            userId: z
              .string()
              .uuid()
              .describe(
                " An ID value to represent the user who owns the payment method",
              ),
            customerId: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the customer id which is generated on the payment gateway.",
              ),
            cardHolderName: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "A string value to represent the name of the card holder. It can be different than the registered customer.",
              ),
            cardHolderZip: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "A string value to represent the zip code of the card holder. It is used for address verification in specific countries.",
              ),
            platform: z
              .string()
              .max(255)
              .describe(
                "A String value to represent payment platform which teh paymentMethod belongs. It is stripe as default. It will be used to distinguesh the payment gateways in the future.",
              ),
            cardInfo: z
              .object()
              .describe(
                "A Json value to store the card details of the payment method.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A payment storage object to store the payment methods of the platform customers",
          )
          .array(),
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
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listethods",
    description: "",
    parameters: ListethodsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listethodsMcpController = new ListethodsMcpController(mcpParams);
      try {
        const result = await listethodsMcpController.processRequest();
        //return ListethodsMcpController.getOutputSchema().parse(result);
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
