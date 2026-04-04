import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useServiceCardQuery } from '@/lib/queries/service-cards.query'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_esm/catalog/$cardId/request')({
  component: ServiceRequestFormPage,
})

function ServiceRequestFormPage() {
  const { cardId } = Route.useParams()
  const navigate = useNavigate()
  const { data: card, isLoading } = useServiceCardQuery(cardId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Service card not found.</p>
        <Button variant="link" asChild>
          <Link to="/catalog">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a request title')
      return
    }
    setSubmitting(true)
    try {
      // TODO: wire to service-requests API once backend endpoint is available
      toast.success('Request submitted successfully')
      navigate({ to: '/catalog' })
    } catch {
      toast.error('Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/catalog/$cardId" params={{ cardId }}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to {card.displayTitle}
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Submit a Request</h1>
        <p className="text-muted-foreground mt-1">{card.displayTitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief summary of your request"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you need in detail..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link to="/catalog/$cardId" params={{ cardId }}>
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
