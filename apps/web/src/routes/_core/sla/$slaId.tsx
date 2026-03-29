import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SlaForm } from '@/components/web/sla/sla-form'
import { useSlaTargetQuery } from '@/lib/queries'
import { useUpdateSlaTargetMutation } from '@/lib/mutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_core/sla/$slaId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slaId } = Route.useParams()
  const navigate = useNavigate()
  const { data: target, isLoading } = useSlaTargetQuery(slaId)
  const updateMutation = useUpdateSlaTargetMutation()

  const handleSubmit = async (values: any) => {
    await updateMutation.mutateAsync({ id: slaId, data: values })
    navigate({ to: '/sla' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit SLA Target: {target?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <SlaForm
            initialData={target}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
