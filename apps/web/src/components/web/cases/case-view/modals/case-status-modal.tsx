import { useState } from 'react'
import { ArrowRightLeftIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUpdateCaseMutation } from '@/lib/mutations'
import { CASE_STATUS_OPTIONS, CaseStatus } from '@/types/cases'
import { CaseStatusBadge } from '../../case-status-badge'

interface CaseStatusModalProps {
  caseId: string
  currentStatus: string
  trigger?: React.ReactNode
}

export function CaseStatusModal({
  caseId,
  currentStatus,
  trigger,
}: CaseStatusModalProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<string>(currentStatus)
  const updateCaseMutation = useUpdateCaseMutation()

  const handleUpdate = async () => {
    await updateCaseMutation.mutateAsync({
      id: caseId,
      data: { status: status as CaseStatus },
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="ml-auto h-8 lg:flex">
            <ArrowRightLeftIcon className="h-3.5 w-3.5" />
            <span className="font-semibold">Change Case Status</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Case Status</DialogTitle>
          <DialogDescription>
            Update the current status of this case.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {CASE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <CaseStatusBadge status={option.value} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            disabled={updateCaseMutation.isPending || status === currentStatus}
          >
            {updateCaseMutation.isPending ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
