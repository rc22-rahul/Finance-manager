import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { convertAmoutFromMiliunits } from "@/lib/utils";

export const useGetTransactions = () => {
  const param = useSearchParams();

  const from = param.get("from") || ""
  const to = param.get("to") || ""
  const accountId = param.get("accountId") || ""

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId
        }
      });

      if (!response.ok){
        throw new Error("Failed to fetch transactions")
      }

      const { data } = await response.json()
      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmoutFromMiliunits(transaction.amount)
      }));
    },
  });

  return query;
}