import { z } from "zod";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";

import { insertAccountSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Loader2 } from "lucide-react";
import { useConfirmModal } from "@/hooks/use-confirm-modal";

const formSchema = insertAccountSchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Are you sure?",
    "You are about to delete this account and its transactions."
  )

  const accountQuery = useGetAccount(id)

  const EditMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id)

  const isPending = EditMutation.isPending || deleteMutation.isPending;

  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name
  } : {
    name: ""
  }

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


  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Account
            </SheetTitle>
            <SheetDescription>
              Edit an existing account.
            </SheetDescription>
          </SheetHeader>
          {accountQuery.isLoading ? (
            <div className="inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground size-8" />
            </div>
          ) : (
            <AccountForm 
              id={id}
              onSubmit={onSubmit} 
              disabled={isPending} 
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};