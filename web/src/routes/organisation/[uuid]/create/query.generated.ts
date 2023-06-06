import type * as Types from '../../../../lib/graphql/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetOrgUnitAndFacetsQueryVariables = Types.Exact<{
  uuid?: Types.InputMaybe<Array<Types.Scalars['UUID']['input']> | Types.Scalars['UUID']['input']>;
  fromDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type GetOrgUnitAndFacetsQuery = { __typename?: 'Query', facets: Array<{ __typename?: 'Facet', uuid?: any | null, user_key: string, classes: Array<{ __typename?: 'Class', name: string, uuid?: any | null }> }>, org_units: Array<{ __typename?: 'OrganisationUnitResponse', objects: Array<{ __typename?: 'OrganisationUnit', uuid?: any | null, name: string, parent?: { __typename?: 'OrganisationUnit', uuid?: any | null, name: string } | null, unit_type?: { __typename?: 'Class', name: string } | null, org_unit_level?: { __typename?: 'Class', name: string } | null }> }> };


export const GetOrgUnitAndFacetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgUnitAndFacets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_keys"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"org_unit_level","block":false},{"kind":"StringValue","value":"org_unit_type","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"user_key"}},{"kind":"Field","name":{"kind":"Name","value":"classes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"org_units"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"from_date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"org_unit_level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgUnitAndFacetsQuery, GetOrgUnitAndFacetsQueryVariables>;