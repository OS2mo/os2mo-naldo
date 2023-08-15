import type * as Types from '../../../../../lib/graphql/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FacetAndOrgQueryVariables = Types.Exact<{
  uuid?: Types.InputMaybe<Array<Types.Scalars['UUID']['input']> | Types.Scalars['UUID']['input']>;
  fromDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type FacetAndOrgQuery = { __typename?: 'Query', facets: Array<{ __typename?: 'Facet', uuid: any, user_key: string, classes: Array<{ __typename?: 'Class', name: string, uuid: any, user_key: string }> }>, employees: Array<{ __typename?: 'EmployeeResponse', objects: Array<{ __typename?: 'Employee', validity: { __typename?: 'OpenValidity', from?: any | null, to?: any | null } }> }> };

export type CreateEngagementMutationVariables = Types.Exact<{
  input: Types.EngagementCreateInput;
}>;


export type CreateEngagementMutation = { __typename?: 'Mutation', engagement_create: { __typename?: 'EngagementResponse', objects: Array<{ __typename?: 'Engagement', employee: Array<{ __typename?: 'Employee', name: string }> }> } };


export const FacetAndOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FacetAndOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_keys"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"engagement_type","block":false},{"kind":"StringValue","value":"engagement_job_function","block":false},{"kind":"StringValue","value":"primary_type","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"user_key"}},{"kind":"Field","name":{"kind":"Name","value":"classes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"user_key"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"employees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FacetAndOrgQuery, FacetAndOrgQueryVariables>;
export const CreateEngagementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEngagement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EngagementCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagement_create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateEngagementMutation, CreateEngagementMutationVariables>;