import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Building2, Mail } from 'lucide-react'

interface CaseRequesterProps {
  requester?: {
    avatar?: string
    display_name?: string
    first_name?: string
    last_name?: string
    email?: string
    department?: {
      name?: string
    }
    phone?: string
    metadata?: {
      title?: string
    }
    manager?: string
  }
}

export function CaseRequester({ requester }: CaseRequesterProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-[6px] border-background shadow-lg group-hover:shadow-xl transition-all duration-300">
              <AvatarImage src={requester?.avatar} />
              <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold font-sans">
                {requester
                  ? `${requester.first_name?.[0] || ''}${requester.last_name?.[0] || ''}`
                  : 'SY'}
              </AvatarFallback>
            </Avatar>
            {/* <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-[3px] border-background" /> */}
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-foreground font-sans">
                  {requester
                    ? requester.display_name ||
                      `${requester.first_name} ${requester.last_name}`
                    : 'System'}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium italic">
                  <Building2 className="h-4 w-4 opacity-70" />
                  {requester?.department?.name || 'No Department'}
                </div>
                <Separator
                  orientation="vertical"
                  className="h-3 bg-border/40"
                />
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <Mail className="h-4 w-4 opacity-70" />
                  {requester?.email || 'No email provided'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/20 pt-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {requester?.phone || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Job Title
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {requester?.metadata?.title || 'Staff member'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Reporting Manager
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {requester?.manager || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
