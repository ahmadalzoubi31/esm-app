import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusIcon, SaveIcon, TrashIcon, EditIcon } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function BusinessLineSettings() {
  const queryClient = useQueryClient()
  
  // Queries
  const { data: businessLinesResponse, isLoading } = useQuery({
    queryKey: ['business-lines'],
    queryFn: async () => {
      const response = await fetch('/api/business-lines')
      if (!response.ok) {
        throw new Error('Failed to fetch business lines')
      }
      return response.json()
    }
  })

  // State
  const [items, setItems] = useState<any[]>([])
  const [newItem, setNewItem] = useState({ name: '', key: '', active: true })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (businessLinesResponse) {
      // Handle array or wrapped response
      const data = Array.isArray(businessLinesResponse) 
        ? businessLinesResponse 
        : businessLinesResponse.data || []
      setItems(data)
    }
  }, [businessLinesResponse])

  // Placeholder for real add mutations later
  const handleAdd = () => {
    if (!newItem.name || !newItem.key) return
    
    // For now, simple optimistic update since API isn't fully created yet
    const newEntry = { 
      id: Math.random().toString(36).substring(7), 
      ...newItem, 
      createdAt: new Date().toISOString() 
    }
    
    setItems(prev => [...prev, newEntry])
    setNewItem({ name: '', key: '', active: true })
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
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
              onChange={(e) => setNewItem({ ...newItem, key: e.target.value.toUpperCase() })}
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
                  <TableCell colSpan={4} className="text-center py-4">Loading business lines...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No business lines found. Add one above.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.key}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
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
