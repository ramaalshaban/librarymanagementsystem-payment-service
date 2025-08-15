const { CreateFeePaymentManager } = require("managers");
const { z } = require("zod");

const PaymentMcpController = require("../../PaymentServiceMcpController");

class CreateFeePaymentMcpController extends PaymentMcpController {
  constructor(params) {
    super("createFeePayment", "createfeepayment", params);
    this.dataName = "feePayment";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateFeePaymentManager(this.request, "mcp");
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
            feeId: z
              .string()
              .uuid()
              .describe("Fee/order for which this payment is made."),
            amountPaid: z
              .number()
              .describe(
                "Amount paid in this transaction (for partial payments).",
              ),
            currency: z.string().max(255).describe("Currency for transaction."),
            userId: z.string().uuid().describe("User/member paying the fee."),
            paymentMethod: z
              .enum(["stripe", "cash", "pos", "other"])
              .describe(
                "Payment method: 0=Stripe (online), 1=manual-cash, 2=manual-POS, 3=other.",
              ),
            paymentStatus: z
              .enum(["pending", "complete", "failed", "canceled"])
              .describe("Status: 0=pending, 1=complete, 2=failed, 3=canceled."),
            paymentDate: z
              .string()
              .describe("Datetime payment attempted/recorded."),
            stripePaymentIntentId: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "If paymentMethod is Stripe, the corresponding Stripe PaymentIntent ID for reconciliation.",
              ),
            handledByUserId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "If staff assisted, user who processed this payment entry.",
              ),
            note: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Optional note about the payment (e.g., staff annotation, POS receipt).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks a fee payment attempt or transaction (Stripe or manual/staff). Stores reference to the fee/order, payment method, status, timing, amount paid, Stripe transaction details, staff involvement when not online.",
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
      feeId: z
        .string()
        .uuid()
        .describe("Fee/order for which this payment is made."),

      amountPaid: z
        .number()
        .describe("Amount paid in this transaction (for partial payments)."),

      currency: z.string().max(255).describe("Currency for transaction."),

      userId: z.string().uuid().describe("User/member paying the fee."),

      paymentMethod: z
        .enum([])
        .describe(
          "Payment method: 0=Stripe (online), 1=manual-cash, 2=manual-POS, 3=other.",
        ),

      paymentStatus: z
        .enum([])
        .describe("Status: 0=pending, 1=complete, 2=failed, 3=canceled."),

      paymentDate: z.string().describe("Datetime payment attempted/recorded."),

      stripePaymentIntentId: z
        .string()
        .max(255)
        .optional()
        .describe(
          "If paymentMethod is Stripe, the corresponding Stripe PaymentIntent ID for reconciliation.",
        ),

      handledByUserId: z
        .string()
        .uuid()
        .optional()
        .describe("If staff assisted, user who processed this payment entry."),

      note: z
        .string()
        .optional()
        .describe(
          "Optional note about the payment (e.g., staff annotation, POS receipt).",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createFeePayment",
    description:
      "Create a new payment record for a library fee/order. Used for Stripe and staff/manual payments.",
    parameters: CreateFeePaymentMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createFeePaymentMcpController = new CreateFeePaymentMcpController(
        mcpParams,
      );
      try {
        const result = await createFeePaymentMcpController.processRequest();
        //return CreateFeePaymentMcpController.getOutputSchema().parse(result);
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
