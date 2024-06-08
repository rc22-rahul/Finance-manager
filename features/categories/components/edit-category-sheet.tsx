import { z } from "zod";

import { CategoryForm } from "@/features/categories/components/category-form";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { insertCategorySchema } from "@/db/schema";

import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

const formSchema = insertCategorySchema.pick({
  name: true
})

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory()
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Are you sure?",
    "You are about to delete this category."
  )

  const categoryQuery = useGetCategory(id)

  const EditMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id)

  const isPending = EditMutation.isPending || deleteMutation.isPending;

  const defaultValues = categoryQuery.data ? {
    name: categoryQuery.data.name
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
              Edit Category
            </SheetTitle>
            <SheetDescription>
              Edit an existing category.
            </SheetDescription>
          </SheetHeader>
          {categoryQuery.isLoading ? (
            <div className="inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground size-8" />
            </div>
          ) : (
            <CategoryForm 
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