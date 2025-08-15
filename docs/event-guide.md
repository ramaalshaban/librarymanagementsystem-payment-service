# EVENT GUIDE

## librarymanagementsystem-payment-service

Handles overdue fee assessment, payment resolution (member and staff), Stripe integration, fee/payment audit trail, and payment oversight for the Smart Library Management System.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `Payment` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `Payment` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `Payment` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `Payment` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `Payment` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent fee-created

**Event topic**: `librarymanagementsystem-payment-service-dbevent-fee-created`

This event is triggered upon the creation of a `fee` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "loanId": "ID",
  "amount": "Double",
  "currency": "String",
  "status": "Enum",
  "status_": "String",
  "statusUpdateDate": "Date",
  "reason": "String",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent fee-updated

**Event topic**: `librarymanagementsystem-payment-service-dbevent-fee-updated`

Activation of this event follows the update of a `fee` data object. The payload contains the updated information under the `fee` attribute, along with the original data prior to update, labeled as `old_fee`.

**Event payload**:

```json
{
  "old_fee": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "loanId": "ID",
    "amount": "Double",
    "currency": "String",
    "status": "Enum",
    "status_": "String",
    "statusUpdateDate": "Date",
    "reason": "String",
    "note": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "fee": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "loanId": "ID",
    "amount": "Double",
    "currency": "String",
    "status": "Enum",
    "status_": "String",
    "statusUpdateDate": "Date",
    "reason": "String",
    "note": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent fee-deleted

**Event topic**: `librarymanagementsystem-payment-service-dbevent-fee-deleted`

This event announces the deletion of a `fee` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "loanId": "ID",
  "amount": "Double",
  "currency": "String",
  "status": "Enum",
  "status_": "String",
  "statusUpdateDate": "Date",
  "reason": "String",
  "note": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent feePayment-created

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feepayment-created`

This event is triggered upon the creation of a `feePayment` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "amountPaid": "Double",
  "currency": "String",
  "userId": "ID",
  "paymentMethod": "Enum",
  "paymentMethod_": "String",
  "paymentStatus": "Enum",
  "paymentStatus_": "String",
  "paymentDate": "Date",
  "stripePaymentIntentId": "String",
  "handledByUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent feePayment-updated

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feepayment-updated`

Activation of this event follows the update of a `feePayment` data object. The payload contains the updated information under the `feePayment` attribute, along with the original data prior to update, labeled as `old_feePayment`.

**Event payload**:

```json
{
  "old_feePayment": {
    "id": "ID",
    "_owner": "ID",
    "feeId": "ID",
    "amountPaid": "Double",
    "currency": "String",
    "userId": "ID",
    "paymentMethod": "Enum",
    "paymentMethod_": "String",
    "paymentStatus": "Enum",
    "paymentStatus_": "String",
    "paymentDate": "Date",
    "stripePaymentIntentId": "String",
    "handledByUserId": "ID",
    "note": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "feePayment": {
    "id": "ID",
    "_owner": "ID",
    "feeId": "ID",
    "amountPaid": "Double",
    "currency": "String",
    "userId": "ID",
    "paymentMethod": "Enum",
    "paymentMethod_": "String",
    "paymentStatus": "Enum",
    "paymentStatus_": "String",
    "paymentDate": "Date",
    "stripePaymentIntentId": "String",
    "handledByUserId": "ID",
    "note": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent feePayment-deleted

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feepayment-deleted`

This event announces the deletion of a `feePayment` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "amountPaid": "Double",
  "currency": "String",
  "userId": "ID",
  "paymentMethod": "Enum",
  "paymentMethod_": "String",
  "paymentStatus": "Enum",
  "paymentStatus_": "String",
  "paymentDate": "Date",
  "stripePaymentIntentId": "String",
  "handledByUserId": "ID",
  "note": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent feeEvent-created

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feeevent-created`

This event is triggered upon the creation of a `feeEvent` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "eventType": "Enum",
  "eventType_": "String",
  "eventDate": "Date",
  "actorUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent feeEvent-updated

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feeevent-updated`

Activation of this event follows the update of a `feeEvent` data object. The payload contains the updated information under the `feeEvent` attribute, along with the original data prior to update, labeled as `old_feeEvent`.

**Event payload**:

```json
{
  "old_feeEvent": {
    "id": "ID",
    "_owner": "ID",
    "feeId": "ID",
    "eventType": "Enum",
    "eventType_": "String",
    "eventDate": "Date",
    "actorUserId": "ID",
    "note": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "feeEvent": {
    "id": "ID",
    "_owner": "ID",
    "feeId": "ID",
    "eventType": "Enum",
    "eventType_": "String",
    "eventDate": "Date",
    "actorUserId": "ID",
    "note": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent feeEvent-deleted

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feeevent-deleted`

This event announces the deletion of a `feeEvent` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "eventType": "Enum",
  "eventType_": "String",
  "eventDate": "Date",
  "actorUserId": "ID",
  "note": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent feePayment-created

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feepayment-created`

This event is triggered upon the creation of a `feePayment` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent feePayment-updated

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feepayment-updated`

Activation of this event follows the update of a `feePayment` data object. The payload contains the updated information under the `feePayment` attribute, along with the original data prior to update, labeled as `old_feePayment`.

**Event payload**:

```json
{
  "old_feePayment": {
    "id": "ID",
    "_owner": "ID",
    "ownerId": "ID",
    "orderId": "ID",
    "paymentId": "String",
    "paymentStatus": "String",
    "statusLiteral": "String",
    "redirectUrl": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "feePayment": {
    "id": "ID",
    "_owner": "ID",
    "ownerId": "ID",
    "orderId": "ID",
    "paymentId": "String",
    "paymentStatus": "String",
    "statusLiteral": "String",
    "redirectUrl": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent feePayment-deleted

**Event topic**: `librarymanagementsystem-payment-service-dbevent-feepayment-deleted`

This event announces the deletion of a `feePayment` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentCustomer-created

**Event topic**: `librarymanagementsystem-payment-service-dbevent-paymentcustomer-created`

This event is triggered upon the creation of a `paymentCustomer` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentCustomer-updated

**Event topic**: `librarymanagementsystem-payment-service-dbevent-paymentcustomer-updated`

Activation of this event follows the update of a `paymentCustomer` data object. The payload contains the updated information under the `paymentCustomer` attribute, along with the original data prior to update, labeled as `old_paymentCustomer`.

**Event payload**:

```json
{
  "old_paymentCustomer": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "customerId": "String",
    "platform": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "paymentCustomer": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "customerId": "String",
    "platform": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent paymentCustomer-deleted

**Event topic**: `librarymanagementsystem-payment-service-dbevent-paymentcustomer-deleted`

This event announces the deletion of a `paymentCustomer` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentMethod-created

**Event topic**: `librarymanagementsystem-payment-service-dbevent-paymentmethod-created`

This event is triggered upon the creation of a `paymentMethod` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent paymentMethod-updated

**Event topic**: `librarymanagementsystem-payment-service-dbevent-paymentmethod-updated`

Activation of this event follows the update of a `paymentMethod` data object. The payload contains the updated information under the `paymentMethod` attribute, along with the original data prior to update, labeled as `old_paymentMethod`.

**Event payload**:

```json
{
  "old_paymentMethod": {
    "id": "ID",
    "_owner": "ID",
    "paymentMethodId": "String",
    "userId": "ID",
    "customerId": "String",
    "cardHolderName": "String",
    "cardHolderZip": "String",
    "platform": "String",
    "cardInfo": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "paymentMethod": {
    "id": "ID",
    "_owner": "ID",
    "paymentMethodId": "String",
    "userId": "ID",
    "customerId": "String",
    "cardHolderName": "String",
    "cardHolderZip": "String",
    "platform": "String",
    "cardInfo": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent paymentMethod-deleted

**Event topic**: `librarymanagementsystem-payment-service-dbevent-paymentmethod-deleted`

This event announces the deletion of a `paymentMethod` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `Payment` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event fee-created

**Event topic**: `elastic-index-librarymanagementsystem_fee-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "loanId": "ID",
  "amount": "Double",
  "currency": "String",
  "status": "Enum",
  "status_": "String",
  "statusUpdateDate": "Date",
  "reason": "String",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event fee-updated

**Event topic**: `elastic-index-librarymanagementsystem_fee-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "loanId": "ID",
  "amount": "Double",
  "currency": "String",
  "status": "Enum",
  "status_": "String",
  "statusUpdateDate": "Date",
  "reason": "String",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event fee-deleted

**Event topic**: `elastic-index-librarymanagementsystem_fee-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "loanId": "ID",
  "amount": "Double",
  "currency": "String",
  "status": "Enum",
  "status_": "String",
  "statusUpdateDate": "Date",
  "reason": "String",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event fee-extended

**Event topic**: `elastic-index-librarymanagementsystem_fee-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event fee-created

**Event topic** : `librarymanagementsystem-payment-service-fee-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-updated

**Event topic** : `librarymanagementsystem-payment-service-fee-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutstartked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutstartked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutcompleted

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutcompleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutrefreshked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutrefreshked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-created

**Event topic** : `librarymanagementsystem-payment-service-feepayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-updated

**Event topic** : `librarymanagementsystem-payment-service-feepayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-created

**Event topic** : `librarymanagementsystem-payment-service-feeevent-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-updated

**Event topic** : `librarymanagementsystem-payment-service-feeevent-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event payment-retrived

**Event topic** : `librarymanagementsystem-payment-service-payment-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbyorderid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbyorderid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbypaymentid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbypaymentid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-created

**Event topic** : `librarymanagementsystem-payment-service-payment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-updated

**Event topic** : `librarymanagementsystem-payment-service-payment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payments-listed

**Event topic** : `librarymanagementsystem-payment-service-payments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feePayments": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event payment-deleted

**Event topic** : `librarymanagementsystem-payment-service-payment-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": false }
}
```

## Route Event customerbyuserid-retrived

**Event topic** : `librarymanagementsystem-payment-service-customerbyuserid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

## Route Event customers-listed

**Event topic** : `librarymanagementsystem-payment-service-customers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentCustomers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event listethods-done

**Event topic** : `librarymanagementsystem-payment-service-listethods-done`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentMethods": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Index Event feepayment-created

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "amountPaid": "Double",
  "currency": "String",
  "userId": "ID",
  "paymentMethod": "Enum",
  "paymentMethod_": "String",
  "paymentStatus": "Enum",
  "paymentStatus_": "String",
  "paymentDate": "Date",
  "stripePaymentIntentId": "String",
  "handledByUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feepayment-updated

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "amountPaid": "Double",
  "currency": "String",
  "userId": "ID",
  "paymentMethod": "Enum",
  "paymentMethod_": "String",
  "paymentStatus": "Enum",
  "paymentStatus_": "String",
  "paymentDate": "Date",
  "stripePaymentIntentId": "String",
  "handledByUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feepayment-deleted

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "amountPaid": "Double",
  "currency": "String",
  "userId": "ID",
  "paymentMethod": "Enum",
  "paymentMethod_": "String",
  "paymentStatus": "Enum",
  "paymentStatus_": "String",
  "paymentDate": "Date",
  "stripePaymentIntentId": "String",
  "handledByUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feepayment-extended

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event fee-created

**Event topic** : `librarymanagementsystem-payment-service-fee-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-updated

**Event topic** : `librarymanagementsystem-payment-service-fee-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutstartked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutstartked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutcompleted

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutcompleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutrefreshked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutrefreshked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-created

**Event topic** : `librarymanagementsystem-payment-service-feepayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-updated

**Event topic** : `librarymanagementsystem-payment-service-feepayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-created

**Event topic** : `librarymanagementsystem-payment-service-feeevent-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-updated

**Event topic** : `librarymanagementsystem-payment-service-feeevent-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event payment-retrived

**Event topic** : `librarymanagementsystem-payment-service-payment-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbyorderid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbyorderid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbypaymentid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbypaymentid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-created

**Event topic** : `librarymanagementsystem-payment-service-payment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-updated

**Event topic** : `librarymanagementsystem-payment-service-payment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payments-listed

**Event topic** : `librarymanagementsystem-payment-service-payments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feePayments": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event payment-deleted

**Event topic** : `librarymanagementsystem-payment-service-payment-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": false }
}
```

## Route Event customerbyuserid-retrived

**Event topic** : `librarymanagementsystem-payment-service-customerbyuserid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

## Route Event customers-listed

**Event topic** : `librarymanagementsystem-payment-service-customers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentCustomers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event listethods-done

**Event topic** : `librarymanagementsystem-payment-service-listethods-done`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentMethods": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Index Event feeevent-created

**Event topic**: `elastic-index-librarymanagementsystem_feeevent-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "eventType": "Enum",
  "eventType_": "String",
  "eventDate": "Date",
  "actorUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feeevent-updated

**Event topic**: `elastic-index-librarymanagementsystem_feeevent-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "eventType": "Enum",
  "eventType_": "String",
  "eventDate": "Date",
  "actorUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feeevent-deleted

**Event topic**: `elastic-index-librarymanagementsystem_feeevent-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "feeId": "ID",
  "eventType": "Enum",
  "eventType_": "String",
  "eventDate": "Date",
  "actorUserId": "ID",
  "note": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feeevent-extended

**Event topic**: `elastic-index-librarymanagementsystem_feeevent-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event fee-created

**Event topic** : `librarymanagementsystem-payment-service-fee-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-updated

**Event topic** : `librarymanagementsystem-payment-service-fee-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutstartked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutstartked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutcompleted

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutcompleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutrefreshked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutrefreshked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-created

**Event topic** : `librarymanagementsystem-payment-service-feepayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-updated

**Event topic** : `librarymanagementsystem-payment-service-feepayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-created

**Event topic** : `librarymanagementsystem-payment-service-feeevent-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-updated

**Event topic** : `librarymanagementsystem-payment-service-feeevent-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event payment-retrived

**Event topic** : `librarymanagementsystem-payment-service-payment-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbyorderid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbyorderid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbypaymentid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbypaymentid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-created

**Event topic** : `librarymanagementsystem-payment-service-payment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-updated

**Event topic** : `librarymanagementsystem-payment-service-payment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payments-listed

**Event topic** : `librarymanagementsystem-payment-service-payments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feePayments": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event payment-deleted

**Event topic** : `librarymanagementsystem-payment-service-payment-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": false }
}
```

## Route Event customerbyuserid-retrived

**Event topic** : `librarymanagementsystem-payment-service-customerbyuserid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

## Route Event customers-listed

**Event topic** : `librarymanagementsystem-payment-service-customers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentCustomers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event listethods-done

**Event topic** : `librarymanagementsystem-payment-service-listethods-done`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentMethods": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Index Event feepayment-created

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feepayment-updated

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feepayment-deleted

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "ownerId": "ID",
  "orderId": "ID",
  "paymentId": "String",
  "paymentStatus": "String",
  "statusLiteral": "String",
  "redirectUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event feepayment-extended

**Event topic**: `elastic-index-librarymanagementsystem_feepayment-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event fee-created

**Event topic** : `librarymanagementsystem-payment-service-fee-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-updated

**Event topic** : `librarymanagementsystem-payment-service-fee-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutstartked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutstartked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutcompleted

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutcompleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutrefreshked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutrefreshked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-created

**Event topic** : `librarymanagementsystem-payment-service-feepayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-updated

**Event topic** : `librarymanagementsystem-payment-service-feepayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-created

**Event topic** : `librarymanagementsystem-payment-service-feeevent-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-updated

**Event topic** : `librarymanagementsystem-payment-service-feeevent-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event payment-retrived

**Event topic** : `librarymanagementsystem-payment-service-payment-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbyorderid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbyorderid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbypaymentid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbypaymentid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-created

**Event topic** : `librarymanagementsystem-payment-service-payment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-updated

**Event topic** : `librarymanagementsystem-payment-service-payment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payments-listed

**Event topic** : `librarymanagementsystem-payment-service-payments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feePayments": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event payment-deleted

**Event topic** : `librarymanagementsystem-payment-service-payment-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": false }
}
```

## Route Event customerbyuserid-retrived

**Event topic** : `librarymanagementsystem-payment-service-customerbyuserid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

## Route Event customers-listed

**Event topic** : `librarymanagementsystem-payment-service-customers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentCustomers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event listethods-done

**Event topic** : `librarymanagementsystem-payment-service-listethods-done`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentMethods": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Index Event paymentcustomer-created

**Event topic**: `elastic-index-librarymanagementsystem_paymentcustomer-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentcustomer-updated

**Event topic**: `elastic-index-librarymanagementsystem_paymentcustomer-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentcustomer-deleted

**Event topic**: `elastic-index-librarymanagementsystem_paymentcustomer-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "customerId": "String",
  "platform": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentcustomer-extended

**Event topic**: `elastic-index-librarymanagementsystem_paymentcustomer-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event fee-created

**Event topic** : `librarymanagementsystem-payment-service-fee-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-updated

**Event topic** : `librarymanagementsystem-payment-service-fee-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutstartked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutstartked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutcompleted

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutcompleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutrefreshked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutrefreshked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-created

**Event topic** : `librarymanagementsystem-payment-service-feepayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-updated

**Event topic** : `librarymanagementsystem-payment-service-feepayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-created

**Event topic** : `librarymanagementsystem-payment-service-feeevent-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-updated

**Event topic** : `librarymanagementsystem-payment-service-feeevent-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event payment-retrived

**Event topic** : `librarymanagementsystem-payment-service-payment-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbyorderid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbyorderid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbypaymentid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbypaymentid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-created

**Event topic** : `librarymanagementsystem-payment-service-payment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-updated

**Event topic** : `librarymanagementsystem-payment-service-payment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payments-listed

**Event topic** : `librarymanagementsystem-payment-service-payments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feePayments": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event payment-deleted

**Event topic** : `librarymanagementsystem-payment-service-payment-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": false }
}
```

## Route Event customerbyuserid-retrived

**Event topic** : `librarymanagementsystem-payment-service-customerbyuserid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

## Route Event customers-listed

**Event topic** : `librarymanagementsystem-payment-service-customers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentCustomers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event listethods-done

**Event topic** : `librarymanagementsystem-payment-service-listethods-done`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentMethods": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Index Event paymentmethod-created

**Event topic**: `elastic-index-librarymanagementsystem_paymentmethod-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentmethod-updated

**Event topic**: `elastic-index-librarymanagementsystem_paymentmethod-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentmethod-deleted

**Event topic**: `elastic-index-librarymanagementsystem_paymentmethod-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "paymentMethodId": "String",
  "userId": "ID",
  "customerId": "String",
  "cardHolderName": "String",
  "cardHolderZip": "String",
  "platform": "String",
  "cardInfo": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event paymentmethod-extended

**Event topic**: `elastic-index-librarymanagementsystem_paymentmethod-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event fee-created

**Event topic** : `librarymanagementsystem-payment-service-fee-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-updated

**Event topic** : `librarymanagementsystem-payment-service-fee-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutstartked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutstartked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutcompleted

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutcompleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event fee-checkoutrefreshked

**Event topic** : `librarymanagementsystem-payment-service-fee-checkoutrefreshked`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `fee` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`fee`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "fee",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-created

**Event topic** : `librarymanagementsystem-payment-service-feepayment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feepayment-updated

**Event topic** : `librarymanagementsystem-payment-service-feepayment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-created

**Event topic** : `librarymanagementsystem-payment-service-feeevent-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event feeevent-updated

**Event topic** : `librarymanagementsystem-payment-service-feeevent-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feeEvent` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feeEvent`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feeEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

## Route Event payment-retrived

**Event topic** : `librarymanagementsystem-payment-service-payment-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbyorderid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbyorderid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event paymentbypaymentid-retrived

**Event topic** : `librarymanagementsystem-payment-service-paymentbypaymentid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-created

**Event topic** : `librarymanagementsystem-payment-service-payment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payment-updated

**Event topic** : `librarymanagementsystem-payment-service-payment-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": true }
}
```

## Route Event payments-listed

**Event topic** : `librarymanagementsystem-payment-service-payments-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayments` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayments`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feePayments": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event payment-deleted

**Event topic** : `librarymanagementsystem-payment-service-payment-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `feePayment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`feePayment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "feePayment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feePayment": { "id": "ID", "isActive": false }
}
```

## Route Event customerbyuserid-retrived

**Event topic** : `librarymanagementsystem-payment-service-customerbyuserid-retrived`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomer` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomer`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "paymentCustomer": { "id": "ID", "isActive": true }
}
```

## Route Event customers-listed

**Event topic** : `librarymanagementsystem-payment-service-customers-listed`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentCustomers` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentCustomers`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentCustomers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentCustomers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

## Route Event listethods-done

**Event topic** : `librarymanagementsystem-payment-service-listethods-done`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `paymentMethods` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`paymentMethods`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "paymentMethods",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "paymentMethods": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
