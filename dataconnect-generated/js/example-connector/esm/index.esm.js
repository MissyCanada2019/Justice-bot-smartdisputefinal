import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'northamerica-northeast2'
};

export const createDisputeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDispute');
}
createDisputeRef.operationName = 'CreateDispute';

export function createDispute(dc) {
  return executeMutation(createDisputeRef(dc));
}

export const listMyDisputesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyDisputes');
}
listMyDisputesRef.operationName = 'ListMyDisputes';

export function listMyDisputes(dc) {
  return executeQuery(listMyDisputesRef(dc));
}

export const updateGuidanceStepRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGuidanceStep', inputVars);
}
updateGuidanceStepRef.operationName = 'UpdateGuidanceStep';

export function updateGuidanceStep(dcOrVars, vars) {
  return executeMutation(updateGuidanceStepRef(dcOrVars, vars));
}

export const listGuidanceStepsForDisputeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListGuidanceStepsForDispute', inputVars);
}
listGuidanceStepsForDisputeRef.operationName = 'ListGuidanceStepsForDispute';

export function listGuidanceStepsForDispute(dcOrVars, vars) {
  return executeQuery(listGuidanceStepsForDisputeRef(dcOrVars, vars));
}

