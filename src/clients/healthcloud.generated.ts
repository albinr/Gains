/* eslint-disable import/no-extraneous-dependencies */
import type * as Types from './__generated__/schema';

import type { Dayjs } from 'dayjs'
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LoginRequestMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type LoginRequestMutation = { readonly __typename: 'Mutation', readonly loginRequest: { readonly __typename: 'EmailNotValidError', readonly message: string } | { readonly __typename: 'LoginRequestSuccessResponse', readonly success: boolean } };

export type LoginConfirmMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  code: Types.Scalars['String'];
}>;


export type LoginConfirmMutation = { readonly __typename: 'Mutation', readonly loginConfirm: { readonly __typename: 'CodeNotValidError', readonly message: string } | { readonly __typename: 'EmailNotValidError', readonly message: string } | { readonly __typename: 'LoginConfirmSuccessfulResponse', readonly accessToken: string } | { readonly __typename: 'LoginFailedError', readonly message: string } };

export type UpsertSamplesMutationVariables = Types.Exact<{
  samples: ReadonlyArray<Types.QuantitySampleUpsert> | Types.QuantitySampleUpsert;
}>;


export type UpsertSamplesMutation = { readonly __typename: 'Mutation', readonly upsertQuantitySamples: { readonly __typename: 'UpsertedResult', readonly upsertedCount: number, readonly insertedCount: number, readonly modifiedCount: number } };

export type ExerciseDefaultFragment = { readonly __typename: 'WorkoutExercise', readonly exerciseType: Types.WorkoutExerciseType, readonly _id: string, readonly name: string };

export type ExercisesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ExercisesQuery = { readonly __typename: 'Query', readonly me: { readonly __typename: 'AuthenticationError', readonly message: string } | { readonly __typename: 'User', readonly _id: string, readonly exercises: ReadonlyArray<{ readonly __typename: 'WorkoutExercise', readonly exerciseType: Types.WorkoutExerciseType, readonly _id: string, readonly name: string }> } };

export const ExerciseDefaultFragmentDoc = gql`
    fragment ExerciseDefault on WorkoutExercise {
  exerciseType
  _id
  name
}
    `;
export const LoginRequestDocument = gql`
    mutation LoginRequest($email: String!) {
  loginRequest(email: $email) {
    ... on LoginRequestSuccessResponse {
      success
    }
    ... on Error {
      message
    }
  }
}
    `;

export function useLoginRequestMutation() {
  return Urql.useMutation<LoginRequestMutation, LoginRequestMutationVariables>(LoginRequestDocument);
};
export const LoginConfirmDocument = gql`
    mutation LoginConfirm($email: String!, $code: String!) {
  loginConfirm(email: $email, code: $code) {
    ... on Error {
      message
    }
    ... on LoginConfirmSuccessfulResponse {
      accessToken
    }
  }
}
    `;

export function useLoginConfirmMutation() {
  return Urql.useMutation<LoginConfirmMutation, LoginConfirmMutationVariables>(LoginConfirmDocument);
};
export const UpsertSamplesDocument = gql`
    mutation UpsertSamples($samples: [QuantitySampleUpsert!]!) {
  upsertQuantitySamples(samples: $samples) {
    upsertedCount
    insertedCount
    modifiedCount
  }
}
    `;

export function useUpsertSamplesMutation() {
  return Urql.useMutation<UpsertSamplesMutation, UpsertSamplesMutationVariables>(UpsertSamplesDocument);
};
export const ExercisesDocument = gql`
    query Exercises {
  me {
    __typename
    ... on AuthenticationError {
      message
    }
    ... on User {
      _id
      exercises {
        ...ExerciseDefault
      }
    }
  }
}
    ${ExerciseDefaultFragmentDoc}`;

export function useExercisesQuery(options?: Omit<Urql.UseQueryArgs<ExercisesQueryVariables>, 'query'>) {
  return Urql.useQuery<ExercisesQuery>({ query: ExercisesDocument, ...options });
};