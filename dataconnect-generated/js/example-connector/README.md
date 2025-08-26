# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`example-connector/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMyDisputes*](#listmydisputes)
  - [*ListGuidanceStepsForDispute*](#listguidancestepsfordispute)
- [**Mutations**](#mutations)
  - [*CreateDispute*](#createdispute)
  - [*UpdateGuidanceStep*](#updateguidancestep)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMyDisputes
You can execute the `ListMyDisputes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
listMyDisputes(): QueryPromise<ListMyDisputesData, undefined>;

interface ListMyDisputesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyDisputesData, undefined>;
}
export const listMyDisputesRef: ListMyDisputesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyDisputes(dc: DataConnect): QueryPromise<ListMyDisputesData, undefined>;

interface ListMyDisputesRef {
  ...
  (dc: DataConnect): QueryRef<ListMyDisputesData, undefined>;
}
export const listMyDisputesRef: ListMyDisputesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyDisputesRef:
```typescript
const name = listMyDisputesRef.operationName;
console.log(name);
```

### Variables
The `ListMyDisputes` query has no variables.
### Return Type
Recall that executing the `ListMyDisputes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyDisputesData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyDisputesData {
  disputes: ({
    id: UUIDString;
    title: string;
    description: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Dispute_Key)[];
}
```
### Using `ListMyDisputes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyDisputes } from '@dataconnect/generated';


// Call the `listMyDisputes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyDisputes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyDisputes(dataConnect);

console.log(data.disputes);

// Or, you can use the `Promise` API.
listMyDisputes().then((response) => {
  const data = response.data;
  console.log(data.disputes);
});
```

### Using `ListMyDisputes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyDisputesRef } from '@dataconnect/generated';


// Call the `listMyDisputesRef()` function to get a reference to the query.
const ref = listMyDisputesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyDisputesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.disputes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.disputes);
});
```

## ListGuidanceStepsForDispute
You can execute the `ListGuidanceStepsForDispute` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
listGuidanceStepsForDispute(vars: ListGuidanceStepsForDisputeVariables): QueryPromise<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;

interface ListGuidanceStepsForDisputeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListGuidanceStepsForDisputeVariables): QueryRef<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
}
export const listGuidanceStepsForDisputeRef: ListGuidanceStepsForDisputeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listGuidanceStepsForDispute(dc: DataConnect, vars: ListGuidanceStepsForDisputeVariables): QueryPromise<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;

interface ListGuidanceStepsForDisputeRef {
  ...
  (dc: DataConnect, vars: ListGuidanceStepsForDisputeVariables): QueryRef<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
}
export const listGuidanceStepsForDisputeRef: ListGuidanceStepsForDisputeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listGuidanceStepsForDisputeRef:
```typescript
const name = listGuidanceStepsForDisputeRef.operationName;
console.log(name);
```

### Variables
The `ListGuidanceStepsForDispute` query requires an argument of type `ListGuidanceStepsForDisputeVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListGuidanceStepsForDisputeVariables {
  disputeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListGuidanceStepsForDispute` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListGuidanceStepsForDisputeData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListGuidanceStepsForDisputeData {
  guidanceSteps: ({
    id: UUIDString;
    instruction: string;
    isComplete?: boolean | null;
    stepNumber: number;
  } & GuidanceStep_Key)[];
}
```
### Using `ListGuidanceStepsForDispute`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listGuidanceStepsForDispute, ListGuidanceStepsForDisputeVariables } from '@dataconnect/generated';

// The `ListGuidanceStepsForDispute` query requires an argument of type `ListGuidanceStepsForDisputeVariables`:
const listGuidanceStepsForDisputeVars: ListGuidanceStepsForDisputeVariables = {
  disputeId: ..., 
};

// Call the `listGuidanceStepsForDispute()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listGuidanceStepsForDispute(listGuidanceStepsForDisputeVars);
// Variables can be defined inline as well.
const { data } = await listGuidanceStepsForDispute({ disputeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listGuidanceStepsForDispute(dataConnect, listGuidanceStepsForDisputeVars);

console.log(data.guidanceSteps);

// Or, you can use the `Promise` API.
listGuidanceStepsForDispute(listGuidanceStepsForDisputeVars).then((response) => {
  const data = response.data;
  console.log(data.guidanceSteps);
});
```

### Using `ListGuidanceStepsForDispute`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listGuidanceStepsForDisputeRef, ListGuidanceStepsForDisputeVariables } from '@dataconnect/generated';

// The `ListGuidanceStepsForDispute` query requires an argument of type `ListGuidanceStepsForDisputeVariables`:
const listGuidanceStepsForDisputeVars: ListGuidanceStepsForDisputeVariables = {
  disputeId: ..., 
};

// Call the `listGuidanceStepsForDisputeRef()` function to get a reference to the query.
const ref = listGuidanceStepsForDisputeRef(listGuidanceStepsForDisputeVars);
// Variables can be defined inline as well.
const ref = listGuidanceStepsForDisputeRef({ disputeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listGuidanceStepsForDisputeRef(dataConnect, listGuidanceStepsForDisputeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guidanceSteps);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guidanceSteps);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateDispute
You can execute the `CreateDispute` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
createDispute(): MutationPromise<CreateDisputeData, undefined>;

interface CreateDisputeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDisputeData, undefined>;
}
export const createDisputeRef: CreateDisputeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDispute(dc: DataConnect): MutationPromise<CreateDisputeData, undefined>;

interface CreateDisputeRef {
  ...
  (dc: DataConnect): MutationRef<CreateDisputeData, undefined>;
}
export const createDisputeRef: CreateDisputeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDisputeRef:
```typescript
const name = createDisputeRef.operationName;
console.log(name);
```

### Variables
The `CreateDispute` mutation has no variables.
### Return Type
Recall that executing the `CreateDispute` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDisputeData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDisputeData {
  dispute_insert: Dispute_Key;
}
```
### Using `CreateDispute`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDispute } from '@dataconnect/generated';


// Call the `createDispute()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDispute();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDispute(dataConnect);

console.log(data.dispute_insert);

// Or, you can use the `Promise` API.
createDispute().then((response) => {
  const data = response.data;
  console.log(data.dispute_insert);
});
```

### Using `CreateDispute`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDisputeRef } from '@dataconnect/generated';


// Call the `createDisputeRef()` function to get a reference to the mutation.
const ref = createDisputeRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDisputeRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dispute_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dispute_insert);
});
```

## UpdateGuidanceStep
You can execute the `UpdateGuidanceStep` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
updateGuidanceStep(vars: UpdateGuidanceStepVariables): MutationPromise<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;

interface UpdateGuidanceStepRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuidanceStepVariables): MutationRef<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;
}
export const updateGuidanceStepRef: UpdateGuidanceStepRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGuidanceStep(dc: DataConnect, vars: UpdateGuidanceStepVariables): MutationPromise<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;

interface UpdateGuidanceStepRef {
  ...
  (dc: DataConnect, vars: UpdateGuidanceStepVariables): MutationRef<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;
}
export const updateGuidanceStepRef: UpdateGuidanceStepRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGuidanceStepRef:
```typescript
const name = updateGuidanceStepRef.operationName;
console.log(name);
```

### Variables
The `UpdateGuidanceStep` mutation requires an argument of type `UpdateGuidanceStepVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGuidanceStepVariables {
  id: UUIDString;
  isComplete: boolean;
}
```
### Return Type
Recall that executing the `UpdateGuidanceStep` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGuidanceStepData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGuidanceStepData {
  guidanceStep_update?: GuidanceStep_Key | null;
}
```
### Using `UpdateGuidanceStep`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGuidanceStep, UpdateGuidanceStepVariables } from '@dataconnect/generated';

// The `UpdateGuidanceStep` mutation requires an argument of type `UpdateGuidanceStepVariables`:
const updateGuidanceStepVars: UpdateGuidanceStepVariables = {
  id: ..., 
  isComplete: ..., 
};

// Call the `updateGuidanceStep()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGuidanceStep(updateGuidanceStepVars);
// Variables can be defined inline as well.
const { data } = await updateGuidanceStep({ id: ..., isComplete: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGuidanceStep(dataConnect, updateGuidanceStepVars);

console.log(data.guidanceStep_update);

// Or, you can use the `Promise` API.
updateGuidanceStep(updateGuidanceStepVars).then((response) => {
  const data = response.data;
  console.log(data.guidanceStep_update);
});
```

### Using `UpdateGuidanceStep`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGuidanceStepRef, UpdateGuidanceStepVariables } from '@dataconnect/generated';

// The `UpdateGuidanceStep` mutation requires an argument of type `UpdateGuidanceStepVariables`:
const updateGuidanceStepVars: UpdateGuidanceStepVariables = {
  id: ..., 
  isComplete: ..., 
};

// Call the `updateGuidanceStepRef()` function to get a reference to the mutation.
const ref = updateGuidanceStepRef(updateGuidanceStepVars);
// Variables can be defined inline as well.
const ref = updateGuidanceStepRef({ id: ..., isComplete: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGuidanceStepRef(dataConnect, updateGuidanceStepVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guidanceStep_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guidanceStep_update);
});
```

