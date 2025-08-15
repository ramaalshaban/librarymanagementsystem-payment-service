const { UpdateFeeManager } = require("managers");
const { z } = require("zod");

const PaymentMcpController = require("../../PaymentServiceMcpController");

class UpdateFeeMcpController extends PaymentMcpController {
  constructor(params) {
    super("updateFee", "updatefee", params);
    this.dataName = "fee";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateFeeManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        fee: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z.string().uuid().describe("User/member who owes the fee."),
            loanId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Loan related to the fee (the checked out item that triggered this fee).",
              ),
            amount: z
              .number()
              .describe(
                "Amount of fee charged (in major currency units: e.g., dollars).",
              ),
            currency: z
              .string()
              .max(255)
              .describe(
                "Three-letter ISO currency code (e.g., 'USD', 'EUR') for the fee.",
              ),
            status: z
              .enum([
                "unpaid",
                "paymentInProgress",
                "paid",
                "waived",
                "canceled",
              ])
              .describe(
                "Current status of the fee/order: 0=Unpaid, 1=PaymentInProgress, 2=Paid, 3=Waived, 4=Canceled",
              ),
            statusUpdateDate: z
              .string()
              .describe(
                "Datetime of last status update (tracks payment/waive/cancel events).",
              ),
            reason: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Reason for fee: overdue, lost, damage, manual, or system note.",
              ),
            note: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Staff-entered note/justification for fee, or system-generated note.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents an individual overdue/lost/damage library fee charged to a member. Serves as order object for Stripe integration and staff/manual payment. Tracks who owes the fee, status, payment tracking, amount, reason, and related lending record.",
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
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      status: z
        .enum([])
        .optional()
        .describe(
          "Current status of the fee/order: 0=Unpaid, 1=PaymentInProgress, 2=Paid, 3=Waived, 4=Canceled",
        ),

      statusUpdateDate: z
        .string()
        .optional()
        .describe(
          "Datetime of last status update (tracks payment/waive/cancel events).",
        ),

      note: z
        .string()
        .optional()
        .describe(
          "Staff-entered note/justification for fee, or system-generated note.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateFee",
    description:
      "Update fee/order details (status, note); used for marking as paid, waived, canceled.",
    parameters: UpdateFeeMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateFeeMcpController = new UpdateFeeMcpController(mcpParams);
      try {
        const result = await updateFeeMcpController.processRequest();
        //return UpdateFeeMcpController.getOutputSchema().parse(result);
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
