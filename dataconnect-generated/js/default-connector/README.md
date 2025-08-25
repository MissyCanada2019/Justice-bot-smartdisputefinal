# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`default-connector/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListLegalMatters*](#listlegalmatters)
  - [*GetCourtForms*](#getcourtforms)
- [**Mutations**](#mutations)
  - [*CreateLegalMatter*](#createlegalmatter)
  - [*CreateUser*](#createuser)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

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

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListLegalMatters
You can execute the `ListLegalMatters` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
listLegalMatters(): QueryPromise<ListLegalMattersData, undefined>;

interface ListLegalMattersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLegalMattersData, undefined>;
}
export const listLegalMattersRef: ListLegalMattersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listLegalMatters(dc: DataConnect): QueryPromise<ListLegalMattersData, undefined>;

interface ListLegalMattersRef {
  ...
  (dc: DataConnect): QueryRef<ListLegalMattersData, undefined>;
}
export const listLegalMattersRef: ListLegalMattersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listLegalMattersRef:
```typescript
const name = listLegalMattersRef.operationName;
console.log(name);
```

### Variables
The `ListLegalMatters` query has no variables.
### Return Type
Recall that executing the `ListLegalMatters` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListLegalMattersData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListLegalMattersData {
  legalMatters: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
  } & LegalMatter_Key)[];
}
```
### Using `ListLegalMatters`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listLegalMatters } from '@firebasegen/default-connector';


// Call the `listLegalMatters()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listLegalMatters();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listLegalMatters(dataConnect);

console.log(data.legalMatters);

// Or, you can use the `Promise` API.
listLegalMatters().then((response) => {
  const data = response.data;
  console.log(data.legalMatters);
});
```

### Using `ListLegalMatters`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listLegalMattersRef } from '@firebasegen/default-connector';


// Call the `listLegalMattersRef()` function to get a reference to the query.
const ref = listLegalMattersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listLegalMattersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.legalMatters);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.legalMatters);
});
```

## GetCourtForms
You can execute the `GetCourtForms` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getCourtForms(vars: GetCourtFormsVariables): QueryPromise<GetCourtFormsData, GetCourtFormsVariables>;

interface GetCourtFormsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourtFormsVariables): QueryRef<GetCourtFormsData, GetCourtFormsVariables>;
}
export const getCourtFormsRef: GetCourtFormsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCourtForms(dc: DataConnect, vars: GetCourtFormsVariables): QueryPromise<GetCourtFormsData, GetCourtFormsVariables>;

interface GetCourtFormsRef {
  ...
  (dc: DataConnect, vars: GetCourtFormsVariables): QueryRef<GetCourtFormsData, GetCourtFormsVariables>;
}
export const getCourtFormsRef: GetCourtFormsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCourtFormsRef:
```typescript
const name = getCourtFormsRef.operationName;
console.log(name);
```

### Variables
The `GetCourtForms` query requires an argument of type `GetCourtFormsVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCourtFormsVariables {
  provinceId: UUIDString;
  municipalityId: UUIDString;
  category: string;
}
```
### Return Type
Recall that executing the `GetCourtForms` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCourtFormsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCourtFormsData {
  courtForms: ({
    id: UUIDString;
    name: string;
    description: string;
    downloadUrl?: string | null;
  } & CourtForm_Key)[];
}
```
### Using `GetCourtForms`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCourtForms, GetCourtFormsVariables } from '@firebasegen/default-connector';

// The `GetCourtForms` query requires an argument of type `GetCourtFormsVariables`:
const getCourtFormsVars: GetCourtFormsVariables = {
  provinceId: ..., 
  municipalityId: ..., 
  category: ..., 
};

// Call the `getCourtForms()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCourtForms(getCourtFormsVars);
// Variables can be defined inline as well.
const { data } = await getCourtForms({ provinceId: ..., municipalityId: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCourtForms(dataConnect, getCourtFormsVars);

console.log(data.courtForms);

// Or, you can use the `Promise` API.
getCourtForms(getCourtFormsVars).then((response) => {
  const data = response.data;
  console.log(data.courtForms);
});
```

### Using `GetCourtForms`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCourtFormsRef, GetCourtFormsVariables } from '@firebasegen/default-connector';

// The `GetCourtForms` query requires an argument of type `GetCourtFormsVariables`:
const getCourtFormsVars: GetCourtFormsVariables = {
  provinceId: ..., 
  municipalityId: ..., 
  category: ..., 
};

// Call the `getCourtFormsRef()` function to get a reference to the query.
const ref = getCourtFormsRef(getCourtFormsVars);
// Variables can be defined inline as well.
const ref = getCourtFormsRef({ provinceId: ..., municipalityId: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCourtFormsRef(dataConnect, getCourtFormsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courtForms);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courtForms);
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

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateLegalMatter
You can execute the `CreateLegalMatter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
createLegalMatter(vars: CreateLegalMatterVariables): MutationPromise<CreateLegalMatterData, CreateLegalMatterVariables>;

interface CreateLegalMatterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLegalMatterVariables): MutationRef<CreateLegalMatterData, CreateLegalMatterVariables>;
}
export const createLegalMatterRef: CreateLegalMatterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLegalMatter(dc: DataConnect, vars: CreateLegalMatterVariables): MutationPromise<CreateLegalMatterData, CreateLegalMatterVariables>;

interface CreateLegalMatterRef {
  ...
  (dc: DataConnect, vars: CreateLegalMatterVariables): MutationRef<CreateLegalMatterData, CreateLegalMatterVariables>;
}
export const createLegalMatterRef: CreateLegalMatterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLegalMatterRef:
```typescript
const name = createLegalMatterRef.operationName;
console.log(name);
```

### Variables
The `CreateLegalMatter` mutation requires an argument of type `CreateLegalMatterVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLegalMatterVariables {
  title: string;
  description?: string | null;
  status: string;
}
```
### Return Type
Recall that executing the `CreateLegalMatter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLegalMatterData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLegalMatterData {
  legalMatter_insert: LegalMatter_Key;
}
```
### Using `CreateLegalMatter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLegalMatter, CreateLegalMatterVariables } from '@firebasegen/default-connector';

// The `CreateLegalMatter` mutation requires an argument of type `CreateLegalMatterVariables`:
const createLegalMatterVars: CreateLegalMatterVariables = {
  title: ..., 
  description: ..., // optional
  status: ..., 
};

// Call the `createLegalMatter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLegalMatter(createLegalMatterVars);
// Variables can be defined inline as well.
const { data } = await createLegalMatter({ title: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLegalMatter(dataConnect, createLegalMatterVars);

console.log(data.legalMatter_insert);

// Or, you can use the `Promise` API.
createLegalMatter(createLegalMatterVars).then((response) => {
  const data = response.data;
  console.log(data.legalMatter_insert);
});
```

### Using `CreateLegalMatter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLegalMatterRef, CreateLegalMatterVariables } from '@firebasegen/default-connector';

// The `CreateLegalMatter` mutation requires an argument of type `CreateLegalMatterVariables`:
const createLegalMatterVars: CreateLegalMatterVariables = {
  title: ..., 
  description: ..., // optional
  status: ..., 
};

// Call the `createLegalMatterRef()` function to get a reference to the mutation.
const ref = createLegalMatterRef(createLegalMatterVars);
// Variables can be defined inline as well.
const ref = createLegalMatterRef({ title: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLegalMatterRef(dataConnect, createLegalMatterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.legalMatter_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.legalMatter_insert);
});
```

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email: string;
  municipalityId: UUIDString;
  provinceId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@firebasegen/default-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  municipalityId: ..., 
  provinceId: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., municipalityId: ..., provinceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@firebasegen/default-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  municipalityId: ..., 
  provinceId: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., municipalityId: ..., provinceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

