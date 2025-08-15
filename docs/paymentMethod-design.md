# Service Design Specification - Object Design for paymentMethod

**librarymanagementsystem-payment-service** documentation

## Document Overview

This document outlines the object design for the `paymentMethod` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## paymentMethod Data Object

### Object Overview

**Description:** A payment storage object to store the payment methods of the platform customers

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property          | Type   | Required | Description                                                                                                                                                               |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paymentMethodId` | String | Yes      | A string value to represent the id of the payment method on the payment platform.                                                                                         |
| `userId`          | ID     | Yes      | An ID value to represent the user who owns the payment method                                                                                                             |
| `customerId`      | String | Yes      | A string value to represent the customer id which is generated on the payment gateway.                                                                                    |
| `cardHolderName`  | String | No       | A string value to represent the name of the card holder. It can be different than the registered customer.                                                                |
| `cardHolderZip`   | String | No       | A string value to represent the zip code of the card holder. It is used for address verification in specific countries.                                                   |
| `platform`        | String | Yes      | A String value to represent payment platform which teh paymentMethod belongs. It is stripe as default. It will be used to distinguesh the payment gateways in the future. |
| `cardInfo`        | Object | Yes      | A Json value to store the card details of the payment method.                                                                                                             |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **platform**: stripe

### Constant Properties

`paymentMethodId` `userId` `customerId` `cardHolderName` `cardHolderZip` `platform`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`paymentMethodId` `userId` `customerId` `cardHolderName` `cardHolderZip` `platform` `cardInfo`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`paymentMethodId` `userId` `customerId` `cardHolderName` `cardHolderZip` `platform` `cardInfo`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`paymentMethodId` `userId` `customerId` `platform` `cardInfo`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Unique Properties

`paymentMethodId`

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

### Secondary Key Properties

`paymentMethodId` `userId` `customerId`

Secondary key properties are used to create an additional indexed identifiers for the data object, allowing for alternative access patterns.
Different than normal indexed properties, secondary keys will act as primary keys and Mindbricks will provide automatic secondary key db utility functions to access the data object by the secondary key.

### Session Data Properties

`userId`

Session data properties are used to store data that is specific to the user session, allowing for personalized experiences and temporary data storage.
If a property is configured as session data, it will be automatically mapped to the related field in the user session during CRUD operations.
Note that session data properties can not be mutated by the user, but only by the system.

- **userId**: ID property will be mapped to the session parameter `userId`.

This property is also used to store the owner of the session data, allowing for ownership checks and access control.

### Filter Properties

`paymentMethodId` `userId` `customerId` `cardHolderName` `cardHolderZip` `platform` `cardInfo`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **paymentMethodId**: String has a filter named `paymentMethodId`

- **userId**: ID has a filter named `userId`

- **customerId**: String has a filter named `customerId`

- **cardHolderName**: String has a filter named `cardHolderName`

- **cardHolderZip**: String has a filter named `cardHolderZip`

- **platform**: String has a filter named `platform`

- **cardInfo**: Object has a filter named `cardInfo`
