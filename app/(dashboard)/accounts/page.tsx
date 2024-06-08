"use client"
import { Loader2, Plus } from "lucide-react";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { columns } from "./column";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccount } from "@/features/accounts/api/use-bulk-delete-accounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"


const AccountsPage = () => {
  const {data: accounts=[], isLoading} = useGetAccounts();
  const deleteAccounts = useBulkDeleteAccount();
  const { onOpen } = useNewAccount()

  const isDisabled = isLoading || deleteAccounts.isPending

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <Skeleton  className="h-8 w-48"/>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-300 size-8" />
          </div>
        </CardContent>
      </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Accounts
          </CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="size-4" />
            <p className="ml-2">Add new</p>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable 
          columns={columns} 
          data={accounts} 
          filterKey="name"
          onDelete={(row) => {
            const ids = row.map(r => r.original.id)
            deleteAccounts.mutate({ ids })
          }}
          disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountsPage;