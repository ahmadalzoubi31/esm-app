import { useState } from 'react'
import { RotateCcwIcon, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpdateCaseMutation } from '@/lib/mutations'
import { useUsersQuery } from '@/lib/queries'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CaseReassignModalProps {
  caseId: string
  currentAssigneeId?: string
  trigger?: React.ReactNode
}

export function CaseReassignModal({
  caseId,
  currentAssigneeId,
  trigger,
}: CaseReassignModalProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    currentAssigneeId,
  )
  const updateCaseMutation = useUpdateCaseMutation()
  const { data: users, isLoading } = useUsersQuery()

  const filteredUsers = users?.filter(
    (user) =>
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpdate = async () => {
    if (!selectedUserId) return
    await updateCaseMutation.mutateAsync({
      id: caseId,
      data: { assigneeId: selectedUserId },
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="ml-auto h-8 lg:flex">
            <RotateCcwIcon className="h-3.5 w-3.5" />
            <span className="font-semibold">Reassign Case</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Case</DialogTitle>
          <DialogDescription>
            Assign this case to a different team member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading users...
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              <div className="grid gap-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                      selectedUserId === user.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.display_name} />
                      <AvatarFallback>
                        {user.display_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No users found.
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updateCaseMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={
              updateCaseMutation.isPending ||
              !selectedUserId ||
              selectedUserId === currentAssigneeId
            }
          >
            {updateCaseMutation.isPending ? 'Reassigning...' : 'Reassign Case'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
