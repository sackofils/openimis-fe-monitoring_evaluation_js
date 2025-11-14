import { useGraphqlMutation } from "@openimis/fe-core";

/**
 * Hook for triggering a recalculation.
 * Expected backend mutation:
 *   mutation recalc($input: RecalculateIndicatorsInput!) {
 *     recalculateIndicators(input: $input) { clientMutationId, startedAt, status, error }
 *   }
 */
export const useRecalculateMutation = (onCompleted, onError, config) => {
  const mutation = useGraphqlMutation(
    `
      mutation RecalculateIndicators($input: RecalculateIndicatorsInput!) {
        recalculateIndicators(input: $input) {
          clientMutationId
          startedAt
          status
          error
        }
      }
    `,
    onCompleted,
    onError,
    config
  );
  return mutation;
};
