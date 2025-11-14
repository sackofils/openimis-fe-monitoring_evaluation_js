import { useGraphqlQuery } from "@openimis/fe-core";

/**
 * Hook to fetch indicators for a given period and optional module filters.
 * Expects backend GraphQL to expose:
 *   query indicators(periodStart: Date!, periodEnd: Date!, modules: [String!]) { code, label, value, target, module }
 */
export const useIndicatorsQuery = ({ periodStart, periodEnd, modules }, config) => {
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
      query Indicators($periodStart: Date!, $periodEnd: Date!, $modules: [String!]) {
        indicators(periodStart: $periodStart, periodEnd: $periodEnd, modules: $modules) {
          code
          label
          module
          value
          target
          unit
        }
      }
    `,
    { periodStart, periodEnd, modules },
    config
  );
  return { isLoading, error, data, refetch };
};
