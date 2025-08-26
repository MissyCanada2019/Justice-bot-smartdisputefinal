import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Assessment_Key {
  id: UUIDString;
  __typename?: 'Assessment_Key';
}

export interface CreateDisputeData {
  dispute_insert: Dispute_Key;
}

export interface Dispute_Key {
  id: UUIDString;
  __typename?: 'Dispute_Key';
}

export interface GuidanceStep_Key {
  id: UUIDString;
  __typename?: 'GuidanceStep_Key';
}

export interface LegalForm_Key {
  id: UUIDString;
  __typename?: 'LegalForm_Key';
}

export interface ListGuidanceStepsForDisputeData {
  guidanceSteps: ({
    id: UUIDString;
    instruction: string;
    isComplete?: boolean | null;
    stepNumber: number;
  } & GuidanceStep_Key)[];
}

export interface ListGuidanceStepsForDisputeVariables {
  disputeId: UUIDString;
}

export interface ListMyDisputesData {
  disputes: ({
    id: UUIDString;
    title: string;
    description: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Dispute_Key)[];
}

export interface UpdateGuidanceStepData {
  guidanceStep_update?: GuidanceStep_Key | null;
}

export interface UpdateGuidanceStepVariables {
  id: UUIDString;
  isComplete: boolean;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateDisputeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDisputeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateDisputeData, undefined>;
  operationName: string;
}
export const createDisputeRef: CreateDisputeRef;

export function createDispute(): MutationPromise<CreateDisputeData, undefined>;
export function createDispute(dc: DataConnect): MutationPromise<CreateDisputeData, undefined>;

interface ListMyDisputesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyDisputesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyDisputesData, undefined>;
  operationName: string;
}
export const listMyDisputesRef: ListMyDisputesRef;

export function listMyDisputes(): QueryPromise<ListMyDisputesData, undefined>;
export function listMyDisputes(dc: DataConnect): QueryPromise<ListMyDisputesData, undefined>;

interface UpdateGuidanceStepRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuidanceStepVariables): MutationRef<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGuidanceStepVariables): MutationRef<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;
  operationName: string;
}
export const updateGuidanceStepRef: UpdateGuidanceStepRef;

export function updateGuidanceStep(vars: UpdateGuidanceStepVariables): MutationPromise<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;
export function updateGuidanceStep(dc: DataConnect, vars: UpdateGuidanceStepVariables): MutationPromise<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;

interface ListGuidanceStepsForDisputeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListGuidanceStepsForDisputeVariables): QueryRef<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListGuidanceStepsForDisputeVariables): QueryRef<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
  operationName: string;
}
export const listGuidanceStepsForDisputeRef: ListGuidanceStepsForDisputeRef;

export function listGuidanceStepsForDispute(vars: ListGuidanceStepsForDisputeVariables): QueryPromise<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
export function listGuidanceStepsForDispute(dc: DataConnect, vars: ListGuidanceStepsForDisputeVariables): QueryPromise<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;

