"use client"
import { Loader2, Plus } from "lucide-react";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategory } from "@/features/categories/api/use-bulk-delete-category";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { columns } from "./column";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const CategoriesPage = () => {
  const {data: categories=[], isLoading} = useGetCategories();
  const deleteCategories = useBulkDeleteCategory();
  const { onOpen } = useNewCategory()

  const isDisabled = isLoading || deleteCategories.isPending

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
            Categories
          </CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="size-4" />
            <p className="ml-2">Add new</p>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={categories} 
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map(r => r.original.id)
              deleteCategories.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoriesPage;