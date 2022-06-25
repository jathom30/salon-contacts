import { FieldSet, Record } from "airtable"
import { useQueryClient, useMutation, QueryKey } from "react-query"

export function useOptimisticMutation<T, R>(
  request: (newVal: T) => Promise<R>,
  QUERY_KEY: QueryKey
) {
  const queryClient = useQueryClient()
  return useMutation(request, {
    onMutate: async (newVal) => {
      await queryClient.cancelQueries(QUERY_KEY)

      const prevVal = queryClient.getQueryData<Record<FieldSet>>(QUERY_KEY)
      if (prevVal) {
        queryClient.setQueryData(QUERY_KEY, {
          ...prevVal,
          fields: {
            ...prevVal.fields,
            ...newVal,
          }
        })
      }
      return { prevVal }
    },
    onSettled: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    }
  })
}