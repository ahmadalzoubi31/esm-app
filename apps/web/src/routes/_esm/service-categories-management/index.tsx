import { createFileRoute } from '@tanstack/react-router'
import {
  useServiceCategoriesQuery,
} from '@/lib/queries/service-categories.query'
import {
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} from '@/lib/mutations/service-categories.mutation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { ServiceCategorySchema } from '@repo/shared'

export const Route = createFileRoute('/_esm/service-categories-management/')({
  component: ServiceCategoriesManagementPage,
})

type FormState = {
  name: string
  description: string
  parentCategoryId: string
}

const emptyForm: FormState = { name: '', description: '', parentCategoryId: '' }

function ServiceCategoriesManagementPage() {
  const { data: categories, isLoading } = useServiceCategoriesQuery()
  const createMutation = useCreateServiceCategoryMutation()
  const updateMutation = useUpdateServiceCategoryMutation()
  const deleteMutation = useDeleteServiceCategoryMutation()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceCategorySchema | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(cat: ServiceCategorySchema) {
    setEditing(cat)
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      parentCategoryId: cat.parentCategoryId ?? '',
    })
    setDialogOpen(true)
  }

  function handleDelete(cat: ServiceCategorySchema) {
    if (!confirm(`Delete category "${cat.name}"?`)) return
    deleteMutation.mutate(cat.id)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dto = {
      name: form.name,
      description: form.description || undefined,
      parentCategoryId: form.parentCategoryId || undefined,
    }
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: dto },
        { onSuccess: () => setDialogOpen(false) },
      )
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setDialogOpen(false),
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Service Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize catalog services into categories
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(categories ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-12"
                  >
                    No categories yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                (categories ?? []).map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {cat.description ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {cat.parent?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(cat)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cat)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2Icon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Category' : 'New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-parent">Parent Category</Label>
              <select
                id="cat-parent"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.parentCategoryId}
                onChange={(e) =>
                  setForm({ ...form, parentCategoryId: e.target.value })
                }
              >
                <option value="">None</option>
                {(categories ?? [])
                  .filter((c) => c.id !== editing?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
