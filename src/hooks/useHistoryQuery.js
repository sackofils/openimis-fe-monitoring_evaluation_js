import { useGraphqlQuery } from "@openimis/fe-core";

/**
 * Hook to fetch the history of recalculations.
 * Expected backend query:
 *   query indicatorRuns { indicatorRuns(orderBy: "-startedAt") { id, startedAt, finishedAt, periodStart, periodEnd, modules, status, error } }
 */
export const useHistoryQuery = (config) => {
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
      query IndicatorRuns {
        indicatorRuns {
          id
          startedAt
          finishedAt
          periodStart
          periodEnd
          modules
          status
          error
        }
      }
    `,
    {},
    config
  );
  return { isLoading, error, data, refetch };
};
