import type * as Types from '../../../../../lib/graphql/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FacetAndOrgQueryVariables = Types.Exact<{
  uuid?: Types.InputMaybe<Array<Types.Scalars['UUID']['input']> | Types.Scalars['UUID']['input']>;
}>;


export type FacetAndOrgQuery = { __typename?: 'Query', facets: { __typename?: 'FacetResponsePaged', objects: Array<{ __typename?: 'FacetResponse', objects: Array<{ __typename?: 'Facet', uuid: any, user_key: string, classes: Array<{ __typename?: 'Class', name: string, uuid: any, user_key: string }> }> }> }, org_units: { __typename?: 'OrganisationUnitResponsePaged', objects: Array<{ __typename?: 'OrganisationUnitResponse', validities: Array<{ __typename?: 'OrganisationUnit', validity: { __typename?: 'Validity', from: any, to?: any | null } }> }> } };

export type CreateEngagementMutationVariables = Types.Exact<{
  input: Types.EngagementCreateInput;
}>;


export type CreateEngagementMutation = { __typename?: 'Mutation', engagement_create: { __typename?: 'EngagementResponse', objects: Array<{ __typename?: 'Engagement', person: Array<{ __typename?: 'Employee', name: string }> }> } };


export const FacetAndOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FacetAndOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_keys"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"engagement_type","block":false},{"kind":"StringValue","value":"engagement_job_function","block":false},{"kind":"StringValue","value":"primary_type","block":false}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"user_key"}},{"kind":"Field","name":{"kind":"Name","value":"classes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"user_key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"org_units"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"from_date"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"to_date"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FacetAndOrgQuery, FacetAndOrgQueryVariables>;
export const CreateEngagementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEngagement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EngagementCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagement_create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateEngagementMutation, CreateEngagementMutationVariables>;