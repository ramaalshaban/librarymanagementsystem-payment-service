# REST API GUIDE

## librarymanagementsystem-payment-service

Handles overdue fee assessment, payment resolution (member and staff), Stripe integration, fee/payment audit trail, and payment oversight for the Smart Library Management System.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Payment Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Payment Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Payment Service via HTTP requests for purposes such as creating, updating, deleting and querying Payment objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Payment Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Payment service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**:
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**:
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.

### Token Locations

When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location             | Token Name / Param Name              |
| -------------------- | ------------------------------------ |
| Query                | access_token                         |
| Authorization Header | Bearer                               |
| Header               | librarymanagementsystem-access-token |
| Cookie               | librarymanagementsystem-access-token |

Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.

## Api Definitions

This section outlines the API endpoints available within the Payment service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Payment service.

This service is configured to listen for HTTP requests on port `3004`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://payment-api-librarymanagementsystem.prw.mindbricks.com`
- **Staging:** `https://payment-api-librarymanagementsystem.staging.mindbricks.com`
- **Production:** `https://payment-api-librarymanagementsystem.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Payment service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Payment` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Payment` service.

### Error Response

If a request encounters an issue, whether due to a logical fault or a technical problem, the service responds with a standardized JSON error structure. The HTTP status code within this response indicates the nature of the error, utilizing commonly recognized codes for clarity:

- **400 Bad Request**: The request was improperly formatted or contained invalid parameters, preventing the server from processing it.
- **401 Unauthorized**: The request lacked valid authentication credentials or the credentials provided do not grant access to the requested resource.
- **404 Not Found**: The requested resource was not found on the server.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

Each error response is structured to provide meaningful insight into the problem, assisting in diagnosing and resolving issues efficiently.

```js
{
  "result": "ERR",
  "status": 400,
  "message": "errMsg_organizationIdisNotAValidID",
  "errCode": 400,
  "date": "2024-03-19T12:13:54.124Z",
  "detail": "String"
}
```

### Object Structure of a Successfull Response

When the `Payment` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

**Key Characteristics of the Response Envelope:**

- **Data Presentation**: Depending on the nature of the request, the service returns either a single data object or an array of objects encapsulated within the JSON envelope.
  - **Creation and Update Routes**: These routes return the unmodified (pure) form of the data object(s), without any associations to other data objects.
  - **Delete Routes**: Even though the data is removed from the database, the last known state of the data object(s) is returned in its pure form.
  - **Get Requests**: A single data object is returned in JSON format.
  - **Get List Requests**: An array of data objects is provided, reflecting a collection of resources.

- **Data Structure and Joins**: The complexity of the data structure in the response can vary based on the route's architectural design and the join options specified in the request. The architecture might inherently limit join operations, or they might be dynamically controlled through query parameters.
  - **Pure Data Forms**: In some cases, the response mirrors the exact structure found in the primary data table, without extensions.
  - **Extended Data Forms**: Alternatively, responses might include data extended through joins with tables within the same service or aggregated from external sources, such as ElasticSearch indices related to other services.
  - **Join Varieties**: The extensions might involve one-to-one joins, resulting in single object associations, or one-to-many joins, leading to an array of objects. In certain instances, the data might even feature nested inclusions from other data objects.

**Design Considerations**: The structure of a route's response data is meticulously crafted during the service's architectural planning. This design ensures that responses adequately reflect the intended data relationships and service logic, providing clients with rich and meaningful information.

**Brief Data**: Certain routes return a condensed version of the object data, intentionally selecting only specific fields deemed useful for that request. In such instances, the route documentation will detail the properties included in the response, guiding developers on what to expect.

### API Response Structure

The API utilizes a standardized JSON envelope to encapsulate responses. This envelope is designed to consistently deliver both the requested data and essential metadata, ensuring that clients can efficiently interpret and utilize the response.

**HTTP Status Codes:**

- **200 OK**: This status code is returned for successful GET, GETLIST, UPDATE, or DELETE operations, indicating that the request has been processed successfully.
- **201 Created**: This status code is specific to CREATE operations, signifying that the requested resource has been successfully created.

**Success Response Format:**

For successful operations, the response includes a `"status": "OK"` property, signaling the successful execution of the request. The structure of a successful response is outlined below:

```json
{
  "status":"OK",
  "statusCode": 200,
  "elapsedMs":126,
  "ssoTime":120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName":"products",
  "method":"GET",
  "action":"getList",
  "appVersion":"Version",
  "rowCount":3
  "products":[{},{},{}],
  "paging": {
    "pageNumber":1,
    "pageRowCount":25,
    "totalRowCount":3,
    "pageCount":1
  },
  "filters": [],
  "uiPermissions": []
}
```

- **`products`**: In this example, this key contains the actual response content, which may be a single object or an array of objects depending on the operation performed.

**Handling Errors:**

For details on handling error scenarios and understanding the structure of error responses, please refer to the "Error Response" section provided earlier in this documentation. It outlines how error conditions are communicated, including the use of HTTP status codes and standardized JSON structures for error messages.

**Route Validation Layers:**

Route Validations may be executed in 4 different layers. The layer is a kind of time definition in the route life cycle. Note that while conditional check times are defined by layers, the fetch actions are defined by access times.

`layer1`: "The first layer of route life cycle which is just after the request parameters are validated and the request is in controller. Any script, validation or data operation in this layer can access the route parameters only. The beforeInstance data is not ready yet."

`layer2`: "The second layer of route life cycle which is just after beforeInstance data is collected before the main operation of the route and the main operation is not started yet. In this layer the collected supplementary data is accessable with the route parameters."

`layer3`: "The third layer of route life cycle which is just after the main operation of the route is completed. In this layer the main operation result is accessable with the beforeInstance data and route parameters. Note that the afterInstance data is not ready yet."

`layer4`: "The last layer of route life cycle which is just after afterInstance supplementary data is collected. In this layer the afterInstance data is accessable with the main operation result, beforeInstance data and route parameters."

## Resources

Payment service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Fee resource

_Resource Definition_ : Represents an individual overdue/lost/damage library fee charged to a member. Serves as order object for Stripe integration and staff/manual payment. Tracks who owes the fee, status, payment tracking, amount, reason, and related lending record.
_Fee Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _User/member who owes the fee._ |
| **loanId** | ID | | | _Loan related to the fee (the checked out item that triggered this fee)._ |
| **amount** | Double | | | _Amount of fee charged (in major currency units: e.g., dollars)._ |
| **currency** | String | | | _Three-letter ISO currency code (e.g., &#39;USD&#39;, &#39;EUR&#39;) for the fee._ |
| **status** | Enum | | | _Current status of the fee/order: 0=Unpaid, 1=PaymentInProgress, 2=Paid, 3=Waived, 4=Canceled_ |
| **statusUpdateDate** | Date | | | _Datetime of last status update (tracks payment/waive/cancel events)._ |
| **reason** | String | | | _Reason for fee: overdue, lost, damage, manual, or system note._ |
| **note** | Text | | | _Staff-entered note/justification for fee, or system-generated note._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **unpaid** | `"unpaid""` | 0 |
| **paymentInProgress** | `"paymentInProgress""` | 1 |
| **paid** | `"paid""` | 2 |
| **waived** | `"waived""` | 3 |
| **canceled** | `"canceled""` | 4 |

### FeePayment resource

_Resource Definition_ : Tracks a fee payment attempt or transaction (Stripe or manual/staff). Stores reference to the fee/order, payment method, status, timing, amount paid, Stripe transaction details, staff involvement when not online.
_FeePayment Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **feeId** | ID | | | _Fee/order for which this payment is made._ |
| **amountPaid** | Double | | | _Amount paid in this transaction (for partial payments)._ |
| **currency** | String | | | _Currency for transaction._ |
| **userId** | ID | | | _User/member paying the fee._ |
| **paymentMethod** | Enum | | | _Payment method: 0=Stripe (online), 1=manual-cash, 2=manual-POS, 3=other._ |
| **paymentStatus** | Enum | | | _Status: 0=pending, 1=complete, 2=failed, 3=canceled._ |
| **paymentDate** | Date | | | _Datetime payment attempted/recorded._ |
| **stripePaymentIntentId** | String | | | _If paymentMethod is Stripe, the corresponding Stripe PaymentIntent ID for reconciliation._ |
| **handledByUserId** | ID | | | _If staff assisted, user who processed this payment entry._ |
| **note** | Text | | | _Optional note about the payment (e.g., staff annotation, POS receipt)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### paymentMethod Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **stripe** | `"stripe""` | 0 |
| **cash** | `"cash""` | 1 |
| **pos** | `"pos""` | 2 |
| **other** | `"other""` | 3 |

##### paymentStatus Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **pending** | `"pending""` | 0 |
| **complete** | `"complete""` | 1 |
| **failed** | `"failed""` | 2 |
| **canceled** | `"canceled""` | 3 |

### FeeEvent resource

_Resource Definition_ : Audit/event log for fee lifecycle: includes creation, payment attempts, waives, cancellations, and staff actions for compliance/audit purposes.
_FeeEvent Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **feeId** | ID | | | _Fee/order this event refers to._ |
| **eventType** | Enum | | | _Fee event type: 0=assessed, 1=paymentAttempt, 2=paymentSuccess, 3=paymentFail, 4=waived, 5=canceled, 6=note._ |
| **eventDate** | Date | | | _Datetime event occurred (auto-now)._ |
| **actorUserId** | ID | | | _User or staff responsible for or affected by event (e.g., created, payment, waived)._ |
| **note** | Text | | | _Optional note or annotation related to the event._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### eventType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **assessed** | `"assessed""` | 0 |
| **paymentAttempt** | `"paymentAttempt""` | 1 |
| **paymentSuccess** | `"paymentSuccess""` | 2 |
| **paymentFail** | `"paymentFail""` | 3 |
| **waived** | `"waived""` | 4 |
| **canceled** | `"canceled""` | 5 |
| **note** | `"note""` | 6 |

### FeePayment resource

_Resource Definition_ : A payment storage object to store the payment life cyle of orders based on fee object. It is autocreated based on the source object&#39;s checkout config
_FeePayment Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **ownerId** | ID | | | _ An ID value to represent owner user who created the order_ |
| **orderId** | ID | | | _an ID value to represent the orderId which is the ID parameter of the source fee object_ |
| **paymentId** | String | | | _A String value to represent the paymentId which is generated on the Stripe gateway. This id may represent different objects due to the payment gateway and the chosen flow type_ |
| **paymentStatus** | String | | | _A string value to represent the payment status which belongs to the lifecyle of a Stripe payment._ |
| **statusLiteral** | String | | | _A string value to represent the logical payment status which belongs to the application lifecycle itself._ |
| **redirectUrl** | String | | | _A string value to represent return page of the frontend to show the result of the payment, this is used when the callback is made to server not the client._ |

### PaymentCustomer resource

_Resource Definition_ : A payment storage object to store the customer values of the payment platform
_PaymentCustomer Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _ An ID value to represent the user who is created as a stripe customer_ |
| **customerId** | String | | | _A string value to represent the customer id which is generated on the Stripe gateway. This id is used to represent the customer in the Stripe gateway_ |
| **platform** | String | | | _A String value to represent payment platform which is used to make the payment. It is stripe as default. It will be used to distinguesh the payment gateways in the future._ |

### PaymentMethod resource

_Resource Definition_ : A payment storage object to store the payment methods of the platform customers
_PaymentMethod Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **paymentMethodId** | String | | | _A string value to represent the id of the payment method on the payment platform._ |
| **userId** | ID | | | _ An ID value to represent the user who owns the payment method_ |
| **customerId** | String | | | _A string value to represent the customer id which is generated on the payment gateway._ |
| **cardHolderName** | String | | | _A string value to represent the name of the card holder. It can be different than the registered customer._ |
| **cardHolderZip** | String | | | _A string value to represent the zip code of the card holder. It is used for address verification in specific countries._ |
| **platform** | String | | | _A String value to represent payment platform which teh paymentMethod belongs. It is stripe as default. It will be used to distinguesh the payment gateways in the future._ |
| **cardInfo** | Object | | | _A Json value to store the card details of the payment method._ |

## Crud Routes

### Route: getFee

_Route Definition_ : Get a specific library fee/order by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/fees/:feeId`

#### Parameters

The getFee api has got 1 parameter

| Parameter | Type | Required | Population            |
| --------- | ---- | -------- | --------------------- |
| feeId     | ID   | true     | request.params?.feeId |

To access the api you can use the **REST** controller with the path **GET /fees/:feeId**

```js
axios({
  method: "GET",
  url: `/fees/${feeId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": true }
}
```

### Route: createFee

_Route Definition_ : Create a new overdue or lost/damage fee entry for a member. May be created by system or staff.

_Route Type_ : create

_Default access route_ : _POST_ `/fees`

#### Parameters

The createFee api has got 8 parameters

| Parameter        | Type   | Required | Population                     |
| ---------------- | ------ | -------- | ------------------------------ |
| userId           | ID     | true     | request.body?.userId           |
| loanId           | ID     | false    | request.body?.loanId           |
| amount           | Double | true     | request.body?.amount           |
| currency         | String | true     | request.body?.currency         |
| status           | Enum   | true     | request.body?.status           |
| statusUpdateDate | Date   | true     | request.body?.statusUpdateDate |
| reason           | String | false    | request.body?.reason           |
| note             | Text   | false    | request.body?.note             |

To access the api you can use the **REST** controller with the path **POST /fees**

```js
axios({
  method: "POST",
  url: "/fees",
  data: {
    userId: "ID",
    loanId: "ID",
    amount: "Double",
    currency: "String",
    status: "Enum",
    statusUpdateDate: "Date",
    reason: "String",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateFee

_Route Definition_ : Update fee/order details (status, note); used for marking as paid, waived, canceled.

_Route Type_ : update

_Default access route_ : _PATCH_ `/fees/:feeId`

#### Parameters

The updateFee api has got 4 parameters

| Parameter        | Type | Required | Population                     |
| ---------------- | ---- | -------- | ------------------------------ |
| feeId            | ID   | true     | request.params?.feeId          |
| status           | Enum | false    | request.body?.status           |
| statusUpdateDate | Date | false    | request.body?.statusUpdateDate |
| note             | Text | false    | request.body?.note             |

To access the api you can use the **REST** controller with the path **PATCH /fees/:feeId**

```js
axios({
  method: "PATCH",
  url: `/fees/${feeId}`,
  data: {
    status: "Enum",
    statusUpdateDate: "Date",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteFee

_Route Definition_ : Delete a fee/order record. Used with care (admin/maintenance only) as this affects audit trail.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/fees/:feeId`

#### Parameters

The deleteFee api has got 1 parameter

| Parameter | Type | Required | Population            |
| --------- | ---- | -------- | --------------------- |
| feeId     | ID   | true     | request.params?.feeId |

To access the api you can use the **REST** controller with the path **DELETE /fees/:feeId**

```js
axios({
  method: "DELETE",
  url: `/fees/${feeId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "fee": { "id": "ID", "isActive": false }
}
```

### Route: listFees

_Route Definition_ : Get a list of library fee/order records, filterable by userId, loanId, status, or other attributes.

_Route Type_ : getList

_Default access route_ : _GET_ `/fees`

The listFees api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /fees**

```js
axios({
  method: "GET",
  url: "/fees",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fees`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "fees",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "fees": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: checkoutstartFee

_Route Type_ : update

_Default access route_ : _PATCH_ `/startcheckout/fee/:feeId`

#### Parameters

The checkoutstartFee api has got 1 parameter

| Parameter | Type | Required | Population            |
| --------- | ---- | -------- | --------------------- |
| feeId     | ID   | true     | request.params?.feeId |

To access the api you can use the **REST** controller with the path **PATCH /startcheckout/fee/:feeId**

```js
axios({
  method: "PATCH",
  url: `/startcheckout/fee/${feeId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: checkoutcompleteFee

_Route Type_ : update

_Default access route_ : _PATCH_ `/completecheckout/fee/:feeId`

#### Parameters

The checkoutcompleteFee api has got 1 parameter

| Parameter | Type | Required | Population            |
| --------- | ---- | -------- | --------------------- |
| feeId     | ID   | true     | request.params?.feeId |

To access the api you can use the **REST** controller with the path **PATCH /completecheckout/fee/:feeId**

```js
axios({
  method: "PATCH",
  url: `/completecheckout/fee/${feeId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: checkoutrefreshFee

_Route Type_ : update

_Default access route_ : _PATCH_ `/refreshcheckout/fee/:feeId`

#### Parameters

The checkoutrefreshFee api has got 1 parameter

| Parameter | Type | Required | Population            |
| --------- | ---- | -------- | --------------------- |
| feeId     | ID   | true     | request.params?.feeId |

To access the api you can use the **REST** controller with the path **PATCH /refreshcheckout/fee/:feeId**

```js
axios({
  method: "PATCH",
  url: `/refreshcheckout/fee/${feeId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`fee`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: getFeePayment

_Route Definition_ : Get a specific fee payment by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/feepayments/:feePaymentId`

#### Parameters

The getFeePayment api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| feePaymentId | ID   | true     | request.params?.feePaymentId |

To access the api you can use the **REST** controller with the path **GET /feepayments/:feePaymentId**

```js
axios({
  method: "GET",
  url: `/feepayments/${feePaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: createFeePayment

_Route Definition_ : Create a new payment record for a library fee/order. Used for Stripe and staff/manual payments.

_Route Type_ : create

_Default access route_ : _POST_ `/feepayments`

#### Parameters

The createFeePayment api has got 10 parameters

| Parameter             | Type   | Required | Population                          |
| --------------------- | ------ | -------- | ----------------------------------- |
| feeId                 | ID     | true     | request.body?.feeId                 |
| amountPaid            | Double | true     | request.body?.amountPaid            |
| currency              | String | true     | request.body?.currency              |
| userId                | ID     | true     | request.body?.userId                |
| paymentMethod         | Enum   | true     | request.body?.paymentMethod         |
| paymentStatus         | Enum   | true     | request.body?.paymentStatus         |
| paymentDate           | Date   | true     | request.body?.paymentDate           |
| stripePaymentIntentId | String | false    | request.body?.stripePaymentIntentId |
| handledByUserId       | ID     | false    | request.body?.handledByUserId       |
| note                  | Text   | false    | request.body?.note                  |

To access the api you can use the **REST** controller with the path **POST /feepayments**

```js
axios({
  method: "POST",
  url: "/feepayments",
  data: {
    feeId: "ID",
    amountPaid: "Double",
    currency: "String",
    userId: "ID",
    paymentMethod: "Enum",
    paymentStatus: "Enum",
    paymentDate: "Date",
    stripePaymentIntentId: "String",
    handledByUserId: "ID",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateFeePayment

_Route Definition_ : Update a fee payment (status, note).

_Route Type_ : update

_Default access route_ : _PATCH_ `/feepayments/:feePaymentId`

#### Parameters

The updateFeePayment api has got 4 parameters

| Parameter     | Type | Required | Population                   |
| ------------- | ---- | -------- | ---------------------------- |
| feePaymentId  | ID   | true     | request.params?.feePaymentId |
| paymentStatus | Enum | false    | request.body?.paymentStatus  |
| paymentDate   | Date | false    | request.body?.paymentDate    |
| note          | Text | false    | request.body?.note           |

To access the api you can use the **REST** controller with the path **PATCH /feepayments/:feePaymentId**

```js
axios({
  method: "PATCH",
  url: `/feepayments/${feePaymentId}`,
  data: {
    paymentStatus: "Enum",
    paymentDate: "Date",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteFeePayment

_Route Definition_ : Delete a fee payment (admin/maintenance only).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/feepayments/:feePaymentId`

#### Parameters

The deleteFeePayment api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| feePaymentId | ID   | true     | request.params?.feePaymentId |

To access the api you can use the **REST** controller with the path **DELETE /feepayments/:feePaymentId**

```js
axios({
  method: "DELETE",
  url: `/feepayments/${feePaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listFeePayments

_Route Definition_ : Get a list of fee payment entries for reporting or reconciliation, filterable by feeId, userId, paymentMethod, paymentStatus, etc.

_Route Type_ : getList

_Default access route_ : _GET_ `/feepayments`

The listFeePayments api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /feepayments**

```js
axios({
  method: "GET",
  url: "/feepayments",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayments`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: getFeeEvent

_Route Definition_ : Get a specific fee event log entry by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/feeevents/:feeEventId`

#### Parameters

The getFeeEvent api has got 1 parameter

| Parameter  | Type | Required | Population                 |
| ---------- | ---- | -------- | -------------------------- |
| feeEventId | ID   | true     | request.params?.feeEventId |

To access the api you can use the **REST** controller with the path **GET /feeevents/:feeEventId**

```js
axios({
  method: "GET",
  url: `/feeevents/${feeEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feeEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": true }
}
```

### Route: createFeeEvent

_Route Definition_ : Log creation of a fee event (audit/compliance) for tracking.

_Route Type_ : create

_Default access route_ : _POST_ `/feeevents`

#### Parameters

The createFeeEvent api has got 5 parameters

| Parameter   | Type | Required | Population                |
| ----------- | ---- | -------- | ------------------------- |
| feeId       | ID   | true     | request.body?.feeId       |
| eventType   | Enum | true     | request.body?.eventType   |
| eventDate   | Date | true     | request.body?.eventDate   |
| actorUserId | ID   | true     | request.body?.actorUserId |
| note        | Text | false    | request.body?.note        |

To access the api you can use the **REST** controller with the path **POST /feeevents**

```js
axios({
  method: "POST",
  url: "/feeevents",
  data: {
    feeId: "ID",
    eventType: "Enum",
    eventDate: "Date",
    actorUserId: "ID",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feeEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateFeeEvent

_Route Definition_ : Update a fee event for correction or additional notes (rare, for audit correction).

_Route Type_ : update

_Default access route_ : _PATCH_ `/feeevents/:feeEventId`

#### Parameters

The updateFeeEvent api has got 1 parameter

| Parameter  | Type | Required | Population                 |
| ---------- | ---- | -------- | -------------------------- |
| feeEventId | ID   | true     | request.params?.feeEventId |

To access the api you can use the **REST** controller with the path **PATCH /feeevents/:feeEventId**

```js
axios({
  method: "PATCH",
  url: `/feeevents/${feeEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feeEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteFeeEvent

_Route Definition_ : Delete a fee event entry (rare, admin/audit fix).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/feeevents/:feeEventId`

#### Parameters

The deleteFeeEvent api has got 1 parameter

| Parameter  | Type | Required | Population                 |
| ---------- | ---- | -------- | -------------------------- |
| feeEventId | ID   | true     | request.params?.feeEventId |

To access the api you can use the **REST** controller with the path **DELETE /feeevents/:feeEventId**

```js
axios({
  method: "DELETE",
  url: `/feeevents/${feeEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feeEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "feeEvent": { "id": "ID", "isActive": false }
}
```

### Route: listFeeEvents

_Route Definition_ : Get a list of fee event logs, filterable by feeId, eventType, actorUserId.

_Route Type_ : getList

_Default access route_ : _GET_ `/feeevents`

The listFeeEvents api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /feeevents**

```js
axios({
  method: "GET",
  url: "/feeevents",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feeEvents`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "feeEvents",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "feeEvents": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getPayment

_Route Type_ : get

_Default access route_ : _GET_ `/payment/:feePaymentId`

#### Parameters

The getPayment api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| feePaymentId | ID   | true     | request.params?.feePaymentId |

To access the api you can use the **REST** controller with the path **GET /payment/:feePaymentId**

```js
axios({
  method: "GET",
  url: `/payment/${feePaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: getPaymentByOrderId

_Route Type_ : get

_Default access route_ : _GET_ `/paymentbyorderid/:feePaymentId`

#### Parameters

The getPaymentByOrderId api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| feePaymentId | ID   | true     | request.params?.feePaymentId |

To access the api you can use the **REST** controller with the path **GET /paymentbyorderid/:feePaymentId**

```js
axios({
  method: "GET",
  url: `/paymentbyorderid/${feePaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: getPaymentByPaymentId

_Route Type_ : get

_Default access route_ : _GET_ `/paymentbypaymentid/:feePaymentId`

#### Parameters

The getPaymentByPaymentId api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| feePaymentId | ID   | true     | request.params?.feePaymentId |

To access the api you can use the **REST** controller with the path **GET /paymentbypaymentid/:feePaymentId**

```js
axios({
  method: "GET",
  url: `/paymentbypaymentid/${feePaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: createPayment

_Route Type_ : create

_Default access route_ : _POST_ `/payment`

#### Parameters

The createPayment api has got 5 parameters

| Parameter     | Type   | Required | Population                  |
| ------------- | ------ | -------- | --------------------------- |
| orderId       | ID     | true     | request.body?.orderId       |
| paymentId     | String | true     | request.body?.paymentId     |
| paymentStatus | String | true     | request.body?.paymentStatus |
| statusLiteral | String | true     | request.body?.statusLiteral |
| redirectUrl   | String | false    | request.body?.redirectUrl   |

To access the api you can use the **REST** controller with the path **POST /payment**

```js
axios({
  method: "POST",
  url: "/payment",
  data: {
    orderId: "ID",
    paymentId: "String",
    paymentStatus: "String",
    statusLiteral: "String",
    redirectUrl: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updatePayment

_Route Type_ : update

_Default access route_ : _PATCH_ `/payment/:feePaymentId`

#### Parameters

The updatePayment api has got 5 parameters

| Parameter     | Type   | Required | Population                   |
| ------------- | ------ | -------- | ---------------------------- |
| feePaymentId  | ID     | true     | request.params?.feePaymentId |
| paymentId     | String | false    | request.body?.paymentId      |
| paymentStatus | String | false    | request.body?.paymentStatus  |
| statusLiteral | String | false    | request.body?.statusLiteral  |
| redirectUrl   | String | false    | request.body?.redirectUrl    |

To access the api you can use the **REST** controller with the path **PATCH /payment/:feePaymentId**

```js
axios({
  method: "PATCH",
  url: `/payment/${feePaymentId}`,
  data: {
    paymentId: "String",
    paymentStatus: "String",
    statusLiteral: "String",
    redirectUrl: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listPayments

_Route Type_ : getList

_Default access route_ : _GET_ `/payments`

The listPayments api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /payments**

```js
axios({
  method: "GET",
  url: "/payments",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayments`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deletePayment

_Route Type_ : delete

_Default access route_ : _DELETE_ `/payment/:feePaymentId`

#### Parameters

The deletePayment api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| feePaymentId | ID   | true     | request.params?.feePaymentId |

To access the api you can use the **REST** controller with the path **DELETE /payment/:feePaymentId**

```js
axios({
  method: "DELETE",
  url: `/payment/${feePaymentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`feePayment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: getCustomerByUserId

_Route Type_ : get

_Default access route_ : _GET_ `/paymentcustomers/:userId`

#### Parameters

The getCustomerByUserId api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| userId    | ID   | true     | request.params?.userId |

To access the api you can use the **REST** controller with the path **GET /paymentcustomers/:userId**

```js
axios({
  method: "GET",
  url: `/paymentcustomers/${userId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`paymentCustomer`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listCustomers

_Route Type_ : getList

_Default access route_ : _GET_ `/customers`

The listCustomers api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /customers**

```js
axios({
  method: "GET",
  url: "/customers",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`paymentCustomers`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listethods

_Route Type_ : getList

_Default access route_ : _GET_ `/listethods`

The listethods api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /listethods**

```js
axios({
  method: "GET",
  url: "/listethods",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`paymentMethods`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Authentication Specific Routes

### Common Routes

### Route: currentuser

_Route Definition_: Retrieves the currently authenticated user's session information.

_Route Type_: sessionInfo

_Access Route_: `GET /currentuser`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Returns the authenticated session object associated with the current access token.
- If no valid session exists, responds with a 401 Unauthorized.

```js
// Sample GET /currentuser call
axios.get("/currentuser", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**
Returns the session object, including user-related data and token information.

```
{
  "sessionId": "9cf23fa8-07d4-4e7c-80a6-ec6d6ac96bb9",
  "userId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
  "email": "user@example.com",
  "fullname": "John Doe",
  "roleId": "user",
  "tenantId": "abc123",
  "accessToken": "jwt-token-string",
  ...
}
```

**Error Response**
**401 Unauthorized:** No active session found.

```
{
  "status": "ERR",
  "message": "No login found"
}
```

**Notes**

- This route is typically used by frontend or mobile applications to fetch the current session state after login.
- The returned session includes key user identity fields, tenant information (if applicable), and the access token for further authenticated requests.
- Always ensure a valid access token is provided in the request to retrieve the session.

### Route: permissions

`*Route Definition*`: Retrieves all effective permission records assigned to the currently authenticated user.

`*Route Type*`: permissionFetch

_Access Route_: `GET /permissions`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Fetches all active permission records (`givenPermissions` entries) associated with the current user session.
- Returns a full array of permission objects.
- Requires a valid session (`access token`) to be available.

```js
// Sample GET /permissions call
axios.get("/permissions", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

Returns an array of permission objects.

```json
[
  {
    "id": "perm1",
    "permissionName": "adminPanel.access",
    "roleId": "admin",
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  },
  {
    "id": "perm2",
    "permissionName": "orders.manage",
    "roleId": null,
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  }
]
```

Each object reflects a single permission grant, aligned with the givenPermissions model:

- `**permissionName**`: The permission the user has.
- `**roleId**`: If the permission was granted through a role. -` **subjectUserId**`: If directly granted to the user.
- `**subjectUserGroupId**`: If granted through a group.
- `**objectId**`: If tied to a specific object (OBAC).
- `**canDo**`: True or false flag to represent if permission is active or restricted.

**Error Responses**

- **401 Unauthorized**: No active session found.

```json
{
  "status": "ERR",
  "message": "No login found"
}
```

- **500 Internal Server Error**: Unexpected error fetching permissions.

**Notes**

- The /permissions route is available across all backend services generated by Mindbricks, not just the auth service.
- Auth service: Fetches permissions freshly from the live database (givenPermissions table).
- Other services: Typically use a cached or projected view of permissions stored in a common ElasticSearch store, optimized for faster authorization checks.

> **Tip**:
> Applications can cache permission results client-side or server-side, but should occasionally refresh by calling this endpoint, especially after login or permission-changing operations.

### Route: permissions/:permissionName

_Route Definition_: Checks whether the current user has access to a specific permission, and provides a list of scoped object exceptions or inclusions.

_Route Type_: permissionScopeCheck

_Access Route_: `GET /permissions/:permissionName`

#### Parameters

| Parameter      | Type   | Required | Population                      |
| -------------- | ------ | -------- | ------------------------------- |
| permissionName | String | Yes      | `request.params.permissionName` |

#### Behavior

- Evaluates whether the current user **has access** to the given `permissionName`.
- Returns a structured object indicating:
  - Whether the permission is generally granted (`canDo`)
  - Which object IDs are explicitly included or excluded from access (`exceptions`)
- Requires a valid session (`access token`).

```js
// Sample GET /permissions/orders.manage
axios.get("/permissions/orders.manage", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

```json
{
  "canDo": true,
  "exceptions": [
    "a1f2e3d4-xxxx-yyyy-zzzz-object1",
    "b2c3d4e5-xxxx-yyyy-zzzz-object2"
  ]
}
```

- If `canDo` is `true`, the user generally has the permission, but not for the objects listed in `exceptions` (i.e., restrictions).
- If `canDo` is `false`, the user does not have the permission by default — but only for the objects in `exceptions`, they do have permission (i.e., selective overrides).
- The exceptions array contains valid **UUID strings**, each corresponding to an object ID (typically from the data model targeted by the permission).

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
