import { z } from "zod";

import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { insertTransactionsSchema } from "@/db/schema";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"


const formSchema = insertTransactionsSchema.omit({
  id: true
})

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Are you sure?",
    "You are about to delete this transaction."
  )

  const transactionQuery = useGetTransaction(id)
  console.log(transactionQuery)

  const EditMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id)

  const defaultValues = transactionQuery.data ? {
    accountId: transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId,
    payee: transactionQuery.data.payee,
    date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    amount: transactionQuery.data.amount.toString(),
    notes: transactionQuery.data.notes
  } : {
    accountId: "",
    categoryId: "",
    payee: "",
    date: new Date(),
    amount: "",
    notes: ""
  }

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name
  });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }))

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name
  });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }))

  const onSubmit = (values: FormValues) => {
    EditMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined,{
        onSuccess: () => {
          onClose();
        }
      });
    }
  }

  const isPending = 
    EditMutation.isPending || 
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending || 
    accountMutation.isPending;

  const isLoading = 
    transactionQuery.isLoading ||
    categoryQuery.isLoading || 
    accountQuery.isLoading;

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Transaction
            </SheetTitle>
            <SheetDescription>
              Edit an existing transaction.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground size-8" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
              onDelete={onDelete}
          />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};