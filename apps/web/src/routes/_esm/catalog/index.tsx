import { createFileRoute, Link } from '@tanstack/react-router'
import { useServiceCategoriesQuery } from '@/lib/queries/service-categories.query'
import { useServiceCardsQuery } from '@/lib/queries/service-cards.query'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { SearchIcon, LayoutGridIcon } from 'lucide-react'
import type { ServiceCategorySchema } from '@repo/shared'

export const Route = createFileRoute('/_esm/catalog/')({
  component: CatalogPage,
})

function CatalogPage() {
  const [search, setSearch] = useState('')
  const { data: categories, isLoading: categoriesLoading } =
    useServiceCategoriesQuery()
  const { data: cards, isLoading: cardsLoading } = useServiceCardsQuery()

  const isLoading = categoriesLoading || cardsLoading

  const filteredCards = (cards ?? []).filter(
    (card) =>
      !search ||
      card.displayTitle.toLowerCase().includes(search.toLowerCase()) ||
      (card.shortDescription ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Catalog</h1>
        <p className="text-muted-foreground mt-1">
          Browse available services and submit requests
        </p>
      </div>

      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {search ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Search results ({filteredCards.length})
          </h2>
          {filteredCards.length === 0 ? (
            <p className="text-muted-foreground">No services match your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <ServiceCardTile key={card.id} card={card} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {(categories ?? []).length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <LayoutGridIcon className="mx-auto h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No service categories yet</p>
              <p className="text-sm mt-1">
                Categories will appear here once created by an administrator.
              </p>
            </div>
          )}
          {(categories ?? []).map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              cards={(cards ?? []).filter(
                (c) => c.serviceId === category.id,
              )}
            />
          ))}
          {(categories ?? []).length > 0 && filteredCards.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(cards ?? []).map((card) => (
                <ServiceCardTile key={card.id} card={card} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CategorySection({
  category,
  cards,
}: {
  category: ServiceCategorySchema
  cards: ReturnType<typeof useServiceCardsQuery>['data'] extends
    | (infer T)[]
    | undefined
    ? T[]
    : never
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{category.name}</h2>
        {category.description && (
          <span className="text-sm text-muted-foreground">
            — {category.description}
          </span>
        )}
      </div>
      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground px-1">
          No services in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <ServiceCardTile key={card.id} card={card} />
          ))}
        </div>
      )}
    </section>
  )
}

function ServiceCardTile({ card }: { card: { id: string; displayTitle: string; shortDescription?: string; icon?: string; colorTheme?: string; badges?: string[]; isRequestable?: boolean } }) {
  return (
    <Link
      to="/catalog/$cardId"
      params={{ cardId: card.id }}
      className="block group"
    >
      <div className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {card.icon ? (
              <span className="text-2xl">{card.icon}</span>
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: card.colorTheme ?? '#6366f1' }}
              >
                {card.displayTitle.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h3 className="font-semibold group-hover:text-primary transition-colors leading-snug">
              {card.displayTitle}
            </h3>
          </div>
        </div>
        {card.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {card.shortDescription}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {(card.badges ?? []).map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
          {card.isRequestable === false && (
            <Badge variant="outline" className="text-xs">
              Info only
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
