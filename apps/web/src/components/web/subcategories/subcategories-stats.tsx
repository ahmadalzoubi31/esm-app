import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderTreeIcon, ActivityIcon } from 'lucide-react'

interface SubcategoriesStatsProps {
  subcategories: any[]
}

export function SubcategoriesStats({ subcategories }: SubcategoriesStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Subcategories
          </CardTitle>
          <FolderTreeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subcategories.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Use</CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subcategories.length}</div>
        </CardContent>
      </Card>
    </div>
  )
}
