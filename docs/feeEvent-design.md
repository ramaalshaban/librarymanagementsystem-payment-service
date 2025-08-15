# Service Design Specification - Object Design for feeEvent

**librarymanagementsystem-payment-service** documentation

## Document Overview

This document outlines the object design for the `feeEvent` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## feeEvent Data Object

### Object Overview

**Description:** Audit/event log for fee lifecycle: includes creation, payment attempts, waives, cancellations, and staff actions for compliance/audit purposes.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **feeEventFeeIndex**: [feeId]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `doUpdate`

The existing record will be updated with the new data.No error will be thrown.

### Properties Schema

| Property      | Type | Required | Description                                                                                                  |
| ------------- | ---- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `feeId`       | ID   | Yes      | Fee/order this event refers to.                                                                              |
| `eventType`   | Enum | Yes      | Fee event type: 0=assessed, 1=paymentAttempt, 2=paymentSuccess, 3=paymentFail, 4=waived, 5=canceled, 6=note. |
| `eventDate`   | Date | Yes      | Datetime event occurred (auto-now).                                                                          |
| `actorUserId` | ID   | Yes      | User or staff responsible for or affected by event (e.g., created, payment, waived).                         |
| `note`        | Text | No       | Optional note or annotation related to the event.                                                            |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`feeId` `eventType` `eventDate` `actorUserId` `note`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **eventType**: [assessed, paymentAttempt, paymentSuccess, paymentFail, waived, canceled, note]

### Elastic Search Indexing

`feeId` `eventType` `actorUserId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`feeId` `eventType` `actorUserId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`feeId` `actorUserId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **feeId**: ID
  Relation to `fee`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **actorUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: Yes

### Filter Properties

`feeId` `eventType` `actorUserId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **feeId**: ID has a filter named `feeId`

- **eventType**: Enum has a filter named `eventType`

- **actorUserId**: ID has a filter named `actorUserId`
