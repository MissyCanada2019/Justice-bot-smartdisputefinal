import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CourtForm_Key {
  id: UUIDString;
  __typename?: 'CourtForm_Key';
}

export interface CreateLegalMatterData {
  legalMatter_insert: LegalMatter_Key;
}

export interface CreateLegalMatterVariables {
  title: string;
  description?: string | null;
  status: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  displayName: string;
  email: string;
  municipalityId: UUIDString;
  provinceId: UUIDString;
}

export interface Deadline_Key {
  id: UUIDString;
  __typename?: 'Deadline_Key';
}

export interface GetCourtFormsData {
  courtForms: ({
    id: UUIDString;
    name: string;
    description: string;
    downloadUrl?: string | null;
  } & CourtForm_Key)[];
}

export interface GetCourtFormsVariables {
  provinceId: UUIDString;
  municipalityId: UUIDString;
  category: string;
}

export interface LegalMatter_Key {
  id: UUIDString;
  __typename?: 'LegalMatter_Key';
}

export interface ListLegalMattersData {
  legalMatters: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
  } & LegalMatter_Key)[];
}

export interface Municipality_Key {
  id: UUIDString;
  __typename?: 'Municipality_Key';
}

export interface Province_Key {
  id: UUIDString;
  __typename?: 'Province_Key';
}

export interface SuggestedFormOnLegalMatter_Key {
  legalMatterId: UUIDString;
  courtFormId: UUIDString;
  __typename?: 'SuggestedFormOnLegalMatter_Key';
}

export interface SuggestedPathOnLegalMatter_Key {
  legalMatterId: UUIDString;
  suggestedPathId: UUIDString;
  __typename?: 'SuggestedPathOnLegalMatter_Key';
}

export interface SuggestedPath_Key {
  id: UUIDString;
  __typename?: 'SuggestedPath_Key';
}

export interface UploadedDocument_Key {
  id: UUIDString;
  __typename?: 'UploadedDocument_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListLegalMattersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLegalMattersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListLegalMattersData, undefined>;
  operationName: string;
}
export const listLegalMattersRef: ListLegalMattersRef;

export function listLegalMatters(): QueryPromise<ListLegalMattersData, undefined>;
export function listLegalMatters(dc: DataConnect): QueryPromise<ListLegalMattersData, undefined>;

interface CreateLegalMatterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLegalMatterVariables): MutationRef<CreateLegalMatterData, CreateLegalMatterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLegalMatterVariables): MutationRef<CreateLegalMatterData, CreateLegalMatterVariables>;
  operationName: string;
}
export const createLegalMatterRef: CreateLegalMatterRef;

export function createLegalMatter(vars: CreateLegalMatterVariables): MutationPromise<CreateLegalMatterData, CreateLegalMatterVariables>;
export function createLegalMatter(dc: DataConnect, vars: CreateLegalMatterVariables): MutationPromise<CreateLegalMatterData, CreateLegalMatterVariables>;

interface GetCourtFormsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourtFormsVariables): QueryRef<GetCourtFormsData, GetCourtFormsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCourtFormsVariables): QueryRef<GetCourtFormsData, GetCourtFormsVariables>;
  operationName: string;
}
export const getCourtFormsRef: GetCourtFormsRef;

export function getCourtForms(vars: GetCourtFormsVariables): QueryPromise<GetCourtFormsData, GetCourtFormsVariables>;
export function getCourtForms(dc: DataConnect, vars: GetCourtFormsVariables): QueryPromise<GetCourtFormsData, GetCourtFormsVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

