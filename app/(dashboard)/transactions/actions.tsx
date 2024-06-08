"use client"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { useConfirmModal } from "@/hooks/use-confirm-modal"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction"


type Props = {
  id: string
}

const Actions = ({ id } : Props) => {
  const { onOpen } = useOpenTransaction()
  const deleteMutation = useDeleteTransaction(id)

  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Are you sure?",
    "You are about to delete this transaction."
  )

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate()
    }
  }
  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="cursor-pointer">
          <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}>
            <Edit className=" size-4 mr-2" />
            <p>Edit</p>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}>
            <Trash2 className="size-4 mr-2"/>
            <p>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Actions