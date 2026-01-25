import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  FileQuestion,
  ArrowLeft,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DefaultNotFoundComponent = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-muted p-6 ring-1 ring-border shadow-sm">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Page Not Found
          </h1>
          <p className="max-w-[500px] text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or doesn't exist.
          </p>
        </div>
      </div>
      <Link to="/" className="no-underline">
        <Button size="lg" className="group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}

export const DefaultErrorComponent = ({ error }: { error?: Error }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-destructive/10 p-6 ring-1 ring-destructive/20 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Something Went Wrong
          </h1>
          <p className="max-w-[500px] text-muted-foreground text-lg">
            {error?.message ||
              'An unexpected error occurred. Please try refreshing the page.'}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          variant="outline"
          onClick={() => window.location.reload()}
          className="group"
        >
          <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
          Reload Page
        </Button>
        <Link to="/" className="no-underline">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}

export const DefaultPendingComponent = () => {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 animate-in fade-in duration-700">
      <div className="relative">
        {/* <div className="h-12 w-12 rounded-full border-4 border-primary/20"></div>
        <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div> */}
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">Loading...</p>
    </div>
  )
}
