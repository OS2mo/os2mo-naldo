import type * as Types from '../../lib/graphql/types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type EmployeesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EmployeesQuery = { __typename?: 'Query', employees: Array<{ __typename?: 'EmployeeResponse', objects: Array<{ __typename?: 'Employee', givenname: string, surname: string, cpr_no?: any | null, uuid: any, engagements: Array<{ __typename?: 'Engagement', job_function: { __typename?: 'Class', name: string }, org_unit: Array<{ __typename?: 'OrganisationUnit', name: string }> }> }> }> };


export const EmployeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Employees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenname"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"cpr_no"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"engagements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job_function"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"org_unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<EmployeesQuery, EmployeesQueryVariables>;