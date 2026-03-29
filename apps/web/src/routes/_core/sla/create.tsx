import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SlaForm } from '@/components/web/sla/sla-form'
import { useCreateSlaTargetMutation } from '@/lib/mutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_esm/sla/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const createMutation = useCreateSlaTargetMutation()

  const handleSubmit = async (values: any) => {
    await createMutation.mutateAsync(values)
    navigate({ to: '/sla' })
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create SLA Target</CardTitle>
        </CardHeader>
        <CardContent>
          <SlaForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  )
}
