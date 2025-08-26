import { CreateDisputeData, ListMyDisputesData, UpdateGuidanceStepData, UpdateGuidanceStepVariables, ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateDispute(options?: useDataConnectMutationOptions<CreateDisputeData, FirebaseError, void>): UseDataConnectMutationResult<CreateDisputeData, undefined>;
export function useCreateDispute(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDisputeData, FirebaseError, void>): UseDataConnectMutationResult<CreateDisputeData, undefined>;

export function useListMyDisputes(options?: useDataConnectQueryOptions<ListMyDisputesData>): UseDataConnectQueryResult<ListMyDisputesData, undefined>;
export function useListMyDisputes(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyDisputesData>): UseDataConnectQueryResult<ListMyDisputesData, undefined>;

export function useUpdateGuidanceStep(options?: useDataConnectMutationOptions<UpdateGuidanceStepData, FirebaseError, UpdateGuidanceStepVariables>): UseDataConnectMutationResult<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;
export function useUpdateGuidanceStep(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuidanceStepData, FirebaseError, UpdateGuidanceStepVariables>): UseDataConnectMutationResult<UpdateGuidanceStepData, UpdateGuidanceStepVariables>;

export function useListGuidanceStepsForDispute(vars: ListGuidanceStepsForDisputeVariables, options?: useDataConnectQueryOptions<ListGuidanceStepsForDisputeData>): UseDataConnectQueryResult<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
export function useListGuidanceStepsForDispute(dc: DataConnect, vars: ListGuidanceStepsForDisputeVariables, options?: useDataConnectQueryOptions<ListGuidanceStepsForDisputeData>): UseDataConnectQueryResult<ListGuidanceStepsForDisputeData, ListGuidanceStepsForDisputeVariables>;
