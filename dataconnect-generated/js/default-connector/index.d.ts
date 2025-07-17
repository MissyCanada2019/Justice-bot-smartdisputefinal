import { ConnectorConfig } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface GeneratedForm_Key {
  id: UUIDString;
  __typename?: 'GeneratedForm_Key';
}

export interface LegalFormTemplate_Key {
  id: UUIDString;
  __typename?: 'LegalFormTemplate_Key';
}

export interface LegalTopic_Key {
  id: UUIDString;
  __typename?: 'LegalTopic_Key';
}

export interface Province_Key {
  id: UUIDString;
  __typename?: 'Province_Key';
}

export interface UserLegalCase_Key {
  id: UUIDString;
  __typename?: 'UserLegalCase_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

