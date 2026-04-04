import { createFileRoute, Link } from '@tanstack/react-router'
import { useServiceCardQuery } from '@/lib/queries/service-cards.query'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeftIcon, ClockIcon, CheckCircleIcon } from 'lucide-react'

export const Route = createFileRoute('/_esm/catalog/$cardId/')({
  component: ServiceCardDetailPage,
})

function ServiceCardDetailPage() {
  const { cardId } = Route.useParams()
  const { data: card, isLoading } = useServiceCardQuery(cardId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Service card not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/catalog">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/catalog">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to catalog
        </Link>
      </Button>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {card.icon ? (
            <span className="text-3xl">{card.icon}</span>
          ) : (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: card.colorTheme ?? '#6366f1' }}
            >
              {card.displayTitle.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{card.displayTitle}</h1>
            <div className="flex flex-wrap gap-1 mt-1">
              {(card.badges ?? []).map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        {card.shortDescription && (
          <p className="text-muted-foreground">{card.shortDescription}</p>
        )}
      </div>

      {card.expectedSla && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Expected SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {card.expectedSla.responseMinutes != null && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Initial Response
                  </p>
                  <p className="font-medium">
                    {card.expectedSla.responseMinutes < 60
                      ? `${card.expectedSla.responseMinutes} min`
                      : `${Math.round(card.expectedSla.responseMinutes / 60)} hr`}
                  </p>
                </div>
              )}
              {card.expectedSla.resolutionMinutes != null && (
                <div>
                  <p className="text-sm text-muted-foreground">Resolution</p>
                  <p className="font-medium">
                    {card.expectedSla.resolutionMinutes < 60
                      ? `${card.expectedSla.resolutionMinutes} min`
                      : `${Math.round(card.expectedSla.resolutionMinutes / 60)} hr`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {card.isRequestable !== false ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">This service is available for request</span>
          </div>
          <Button size="lg" asChild>
            <Link to="/catalog/$cardId/request" params={{ cardId: card.id }}>
              Submit a Request
            </Link>
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          This is an informational service card and cannot be requested directly.
        </p>
      )}
    </div>
  )
}
