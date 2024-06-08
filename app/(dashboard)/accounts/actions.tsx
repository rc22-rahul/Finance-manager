"use client"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"
import { useConfirmModal } from "@/hooks/use-confirm-modal"


type Props = {
  id: string
}

const Actions = ({ id } : Props) => {
  const { onOpen } = useOpenAccount()
  const deleteMutation = useDeleteAccount(id)

  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Are you sure?",
    "You are about to delete this account and its transactions."
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