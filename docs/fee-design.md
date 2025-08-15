# Service Design Specification - Object Design for fee

**librarymanagementsystem-payment-service** documentation

## Document Overview

This document outlines the object design for the `fee` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## fee Data Object

### Object Overview

**Description:** Represents an individual overdue/lost/damage library fee charged to a member. Serves as order object for Stripe integration and staff/manual payment. Tracks who owes the fee, status, payment tracking, amount, reason, and related lending record.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **userLoanFeeIndex**: [userId, loanId]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `doUpdate`

The existing record will be updated with the new data.No error will be thrown.

### Stripe Integration

This data object is configured to integrate with Stripe for order management of `fee`. It is designed to handle payment processing and order tracking.
To manage payments, Mindbricks will design additional Crud Routes arround this data object, which will be used checkout orders and charge customers.

- **Order Name**: `fee`

- **Order Id Property**: this.fee.id
  This MScript expression is used to extract the order's unique identifier from the data object.
- **Order Amount Property**: this.fee.amount
  This MScript expression is used to determine the order amount for payment. It should return a numeric value representing the total amount to be charged.
- **Order Currency Property**: this.fee.currency
  This MScript expression is used to determine the currency for the order. It should return a string representing the currency code (e.g., "USD", "EUR").
- **Order Description Property**: `Library overdue fee for user ${this.fee.userId}, fee ${this.fee.id}`
  This MScript expression is used to provide a description for the order, which will be shown in Stripe and on customer receipts. It should return a string that describes the order.
- **Order Status Property**: status
  This property is selected as the order status property, which will be used to track the current status of the order.
  It will be automatically updated based on payment results from Stripe.
- **Order Status Update Date Property**: statusUpdateDate
  This property is selected to record the timestamp of the last order status update. It will be automatically managed during payment events to reflect when the status was last changed.
- **Order Owner Id Property**: userId
  This property is selected as the order owner property, which will be used to track the user who owns the order.
  It will be used to ensure correct access control in payment flows, allowing only the owner to manage their orders.
- **Map Payment Result to Order Status**:
  This configuration defines how Stripe's payment results (e.g., started, success, failed, canceled) map to internal order statuses.,
  `paymentResultStarted` status will be mapped to a local value using `1` and will be set to `status`property.
  `paymentResultCanceled` status will be mapped to a local value using `3` and will be set to `status` property.
  `paymentResultFailed` status will be mapped to a local value using `4` and will be set to `status` property.
  `paymentResultSuccess` status will be mapped to a local value using `2` and will be set to `status` property.
- **On Checkout Error**: continueRoute

if an error occurs during the checkout process, the route will continue to execute, allowing for custom error handling.
In this case, the payment error will ve recorded as a status update. To make a retry a new checkout, a new order will be created with the same data as the original order.

### Properties Schema

| Property           | Type   | Required | Description                                                                                  |
| ------------------ | ------ | -------- | -------------------------------------------------------------------------------------------- |
| `userId`           | ID     | Yes      | User/member who owes the fee.                                                                |
| `loanId`           | ID     | No       | Loan related to the fee (the checked out item that triggered this fee).                      |
| `amount`           | Double | Yes      | Amount of fee charged (in major currency units: e.g., dollars).                              |
| `currency`         | String | Yes      | Three-letter ISO currency code (e.g., &#39;USD&#39;, &#39;EUR&#39;) for the fee.             |
| `status`           | Enum   | Yes      | Current status of the fee/order: 0=Unpaid, 1=PaymentInProgress, 2=Paid, 3=Waived, 4=Canceled |
| `statusUpdateDate` | Date   | Yes      | Datetime of last status update (tracks payment/waive/cancel events).                         |
| `reason`           | String | No       | Reason for fee: overdue, lost, damage, manual, or system note.                               |
| `note`             | Text   | No       | Staff-entered note/justification for fee, or system-generated note.                          |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **currency**: USD

### Constant Properties

`userId` `loanId` `amount` `currency` `reason`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`status` `statusUpdateDate` `note`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **status**: [unpaid, paymentInProgress, paid, waived, canceled]

### Elastic Search Indexing

`userId` `loanId` `status` `reason`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`userId` `loanId` `status`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`userId` `loanId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **userId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: Yes

- **loanId**: ID
  Relation to `loan`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`userId` `loanId` `amount` `status` `reason`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **userId**: ID has a filter named `userId`

- **loanId**: ID has a filter named `loanId`

- **amount**: Double has a filter named `amount`

- **status**: Enum has a filter named `status`

- **reason**: String has a filter named `reason`
