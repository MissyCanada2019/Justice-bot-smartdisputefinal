const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'northamerica-northeast2'
};
exports.connectorConfig = connectorConfig;

const createDisputeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDispute');
}
createDisputeRef.operationName = 'CreateDispute';
exports.createDisputeRef = createDisputeRef;

exports.createDispute = function createDispute(dc) {
  return executeMutation(createDisputeRef(dc));
};

const listMyDisputesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyDisputes');
}
listMyDisputesRef.operationName = 'ListMyDisputes';
exports.listMyDisputesRef = listMyDisputesRef;

exports.listMyDisputes = function listMyDisputes(dc) {
  return executeQuery(listMyDisputesRef(dc));
};

const updateGuidanceStepRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGuidanceStep', inputVars);
}
updateGuidanceStepRef.operationName = 'UpdateGuidanceStep';
exports.updateGuidanceStepRef = updateGuidanceStepRef;

exports.updateGuidanceStep = function updateGuidanceStep(dcOrVars, vars) {
  return executeMutation(updateGuidanceStepRef(dcOrVars, vars));
};

const listGuidanceStepsForDisputeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListGuidanceStepsForDispute', inputVars);
}
listGuidanceStepsForDisputeRef.operationName = 'ListGuidanceStepsForDispute';
exports.listGuidanceStepsForDisputeRef = listGuidanceStepsForDisputeRef;

exports.listGuidanceStepsForDispute = function listGuidanceStepsForDispute(dcOrVars, vars) {
  return executeQuery(listGuidanceStepsForDisputeRef(dcOrVars, vars));
};
