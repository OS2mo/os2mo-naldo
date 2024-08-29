import type * as Types from '../../lib/graphql/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type OrgUnitsWithChildrenQueryVariables = Types.Exact<{
  fromDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type OrgUnitsWithChildrenQuery = { org_units: { objects: Array<{ validities: Array<{ name: string, uuid: any, has_children: boolean }> }> } };

export type RelatedUnitsQueryVariables = Types.Exact<{
  org_unit?: Types.InputMaybe<Array<Types.Scalars['UUID']['input']> | Types.Scalars['UUID']['input']>;
  fromDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type RelatedUnitsQuery = { related_units: { objects: Array<{ validities: Array<{ org_units: Array<{ name: string, uuid: any }>, validity: { from: any, to?: any | null } }> }> } };

export type UpdateRelatedUnitsMutationVariables = Types.Exact<{
  input: Types.RelatedUnitsUpdateInput;
}>;


export type UpdateRelatedUnitsMutation = { related_units_update: { uuid: any, validities: Array<{ org_units: Array<{ name: string }> }> } };

export type OrgUnitChildrenQueryVariables = Types.Exact<{
  uuid?: Types.InputMaybe<Array<Types.Scalars['UUID']['input']> | Types.Scalars['UUID']['input']>;
  fromDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type OrgUnitChildrenQuery = { org_units: { objects: Array<{ validities: Array<{ name: string, uuid: any, has_children: boolean }> }> } };


export const OrgUnitsWithChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrgUnitsWithChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_units"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"parents"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"has_children"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}]}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<OrgUnitsWithChildrenQuery, OrgUnitsWithChildrenQueryVariables>;
export const RelatedUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RelatedUnits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_unit"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"related_units"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org_unit"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_unit"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"validity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RelatedUnitsQuery, RelatedUnitsQueryVariables>;
export const UpdateRelatedUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRelatedUnits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RelatedUnitsUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"related_units_update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"validities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRelatedUnitsMutation, UpdateRelatedUnitsMutationVariables>;
export const OrgUnitChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrgUnitChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_units"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"parents"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"has_children"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}]}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<OrgUnitChildrenQuery, OrgUnitChildrenQueryVariables>;