import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlusIcon, SaveIcon, TrashIcon, EditIcon, XIcon } from 'lucide-react'
import { useBusinessLinesQuery } from '@/lib/queries/business-lines.query'
import {
  useCreateBusinessLineMutation,
  useDeleteBusinessLineMutation,
  useUpdateBusinessLineMutation,
} from '@/lib/mutations/business-lines.mutation'

export function BusinessLineSettings() {
  // Queries
  const { data: businessLinesResponse, isLoading } = useBusinessLinesQuery()

  // Mutations
  const createMutation = useCreateBusinessLineMutation()
  const deleteMutation = useDeleteBusinessLineMutation()
  const updateMutation = useUpdateBusinessLineMutation()

  // State
  const [items, setItems] = useState<any[]>([])
  const [newItem, setNewItem] = useState({ name: '', key: '', active: true })

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: '', key: '', active: true })

  useEffect(() => {
    if (businessLinesResponse) {
      // Handle array or wrapped response
      const data = Array.isArray(businessLinesResponse)
        ? businessLinesResponse
        : (businessLinesResponse as any).data || []
      setItems(data)
    } else {
      setItems([])
    }
  }, [businessLinesResponse])

  const handleAdd = async () => {
    if (!newItem.name || !newItem.key) return
    if (createMutation.isPending) return

    await createMutation.mutateAsync({
      name: newItem.name,
      key: newItem.key,
      description: '',
      active: newItem.active,
    })

    setNewItem({ name: '', key: '', active: true })
  }

  const handleDelete = async (id: string) => {
    if (deleteMutation.isPending) return
    await deleteMutation.mutateAsync(id)
  }

  const startEdit = (item: any) => {
    setEditingId(item.id)
    setEditData({ name: item.name, key: item.key, active: item.active ?? true })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({ name: '', key: '', active: true })
  }

  const handleSaveEdit = async (id: string) => {
    if (!editData.name || !editData.key) return
    if (updateMutation.isPending) return

    await updateMutation.mutateAsync({
      id,
      data: {
        name: editData.name,
        key: editData.key,
        active: editData.active,
      },
    })

    cancelEdit()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Lines</CardTitle>
        <CardDescription>
          Manage business lines available for assigning to groups.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Form */}
        <div className="flex gap-2 items-end border p-4 rounded-md bg-muted/20">
          <div className="grid flex-1 gap-2">
            <label className="text-sm font-medium leading-none">Name</label>
            <Input
              placeholder="e.g. Information Technology"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div className="grid flex-1 gap-2">
            <label className="text-sm font-medium leading-none">Key</label>
            <Input
              placeholder="e.g. IT"
              value={newItem.key}
              onChange={(e) =>
                setNewItem({ ...newItem, key: e.target.value.toUpperCase() })
              }
            />
          </div>
          <Button onClick={handleAdd}>
            <PlusIcon className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Loading business lines...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No business lines found. Add one above.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {editingId === item.id ? (
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          autoFocus
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          value={editData.key}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              key: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      ) : (
                        item.key
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Switch
                          checked={editData.active}
                          onCheckedChange={(checked) =>
                            setEditData({ ...editData, active: checked })
                          }
                        />
                      ) : item.active !== false ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === item.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(item.id)}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                              disabled={updateMutation.isPending}
                            >
                              <SaveIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEdit}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              disabled={updateMutation.isPending}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              disabled={deleteMutation.isPending}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
