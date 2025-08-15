# Service Design Specification - Object Design for feePayment

**librarymanagementsystem-payment-service** documentation

## Document Overview

This document outlines the object design for the `feePayment` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## feePayment Data Object

### Object Overview

**Description:** A payment storage object to store the payment life cyle of orders based on fee object. It is autocreated based on the source object&#39;s checkout config

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property        | Type   | Required | Description                                                                                                                                                                     |
| --------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ownerId`       | ID     | No       | An ID value to represent owner user who created the order                                                                                                                       |
| `orderId`       | ID     | Yes      | an ID value to represent the orderId which is the ID parameter of the source fee object                                                                                         |
| `paymentId`     | String | Yes      | A String value to represent the paymentId which is generated on the Stripe gateway. This id may represent different objects due to the payment gateway and the chosen flow type |
| `paymentStatus` | String | Yes      | A string value to represent the payment status which belongs to the lifecyle of a Stripe payment.                                                                               |
| `statusLiteral` | String | Yes      | A string value to represent the logical payment status which belongs to the application lifecycle itself.                                                                       |
| `redirectUrl`   | String | No       | A string value to represent return page of the frontend to show the result of the payment, this is used when the callback is made to server not the client.                     |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **statusLiteral**: started

### Constant Properties

`orderId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`ownerId` `orderId` `paymentId` `paymentStatus` `statusLiteral` `redirectUrl`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`ownerId` `orderId` `paymentId` `paymentStatus` `statusLiteral` `redirectUrl`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`ownerId` `orderId` `paymentId` `paymentStatus` `statusLiteral` `redirectUrl`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Unique Properties

`orderId`

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

### Secondary Key Properties

`orderId`

Secondary key properties are used to create an additional indexed identifiers for the data object, allowing for alternative access patterns.
Different than normal indexed properties, secondary keys will act as primary keys and Mindbricks will provide automatic secondary key db utility functions to access the data object by the secondary key.

### Session Data Properties

`ownerId`

Session data properties are used to store data that is specific to the user session, allowing for personalized experiences and temporary data storage.
If a property is configured as session data, it will be automatically mapped to the related field in the user session during CRUD operations.
Note that session data properties can not be mutated by the user, but only by the system.

- **ownerId**: ID property will be mapped to the session parameter `userId`.

This property is also used to store the owner of the session data, allowing for ownership checks and access control.

### Filter Properties

`ownerId` `orderId` `paymentId` `paymentStatus` `statusLiteral` `redirectUrl`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **ownerId**: ID has a filter named `ownerId`

- **orderId**: ID has a filter named `orderId`

- **paymentId**: String has a filter named `paymentId`

- **paymentStatus**: String has a filter named `paymentStatus`

- **statusLiteral**: String has a filter named `statusLiteral`

- **redirectUrl**: String has a filter named `redirectUrl`
*handledByUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`feeId` `userId` `paymentMethod` `paymentStatus`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **feeId**: ID has a filter named `feeId`

- **userId**: ID has a filter named `userId`

- **paymentMethod**: Enum has a filter named `paymentMethod`

- **paymentStatus**: Enum has a filter named `paymentStatus`
