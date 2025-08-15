const { CreateFeeEventManager } = require("managers");
const { z } = require("zod");

const PaymentMcpController = require("../../PaymentServiceMcpController");

class CreateFeeEventMcpController extends PaymentMcpController {
  constructor(params) {
    super("createFeeEvent", "createfeeevent", params);
    this.dataName = "feeEvent";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateFeeEventManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        feeEvent: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            feeId: z
              .string()
              .uuid()
              .describe("Fee/order this event refers to."),
            eventType: z
              .enum([
                "assessed",
                "paymentAttempt",
                "paymentSuccess",
                "paymentFail",
                "waived",
                "canceled",
                "note",
              ])
              .describe(
                "Fee event type: 0=assessed, 1=paymentAttempt, 2=paymentSuccess, 3=paymentFail, 4=waived, 5=canceled, 6=note.",
              ),
            eventDate: z
              .string()
              .describe("Datetime event occurred (auto-now)."),
            actorUserId: z
              .string()
              .uuid()
              .describe(
                "User or staff responsible for or affected by event (e.g., created, payment, waived).",
              ),
            note: z
              .string()
              .optional()
              .nullable()
              .describe("Optional note or annotation related to the event."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Audit/event log for fee lifecycle: includes creation, payment attempts, waives, cancellations, and staff actions for compliance/audit purposes.",
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
      feeId: z.string().uuid().describe("Fee/order this event refers to."),

      eventType: z
        .enum([])
        .describe(
          "Fee event type: 0=assessed, 1=paymentAttempt, 2=paymentSuccess, 3=paymentFail, 4=waived, 5=canceled, 6=note.",
        ),

      eventDate: z.string().describe("Datetime event occurred (auto-now)."),

      actorUserId: z
        .string()
        .uuid()
        .describe(
          "User or staff responsible for or affected by event (e.g., created, payment, waived).",
        ),

      note: z
        .string()
        .optional()
        .describe("Optional note or annotation related to the event."),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createFeeEvent",
    description: "Log creation of a fee event (audit/compliance) for tracking.",
    parameters: CreateFeeEventMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createFeeEventMcpController = new CreateFeeEventMcpController(
        mcpParams,
      );
      try {
        const result = await createFeeEventMcpController.processRequest();
        //return CreateFeeEventMcpController.getOutputSchema().parse(result);
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
