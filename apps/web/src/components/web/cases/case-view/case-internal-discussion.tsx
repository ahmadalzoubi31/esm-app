import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Paperclip, Activity } from 'lucide-react'

interface CaseInternalDiscussionProps {
  requester?: {
    avatar?: string
  }
}

export function CaseInternalDiscussion({
  requester,
}: CaseInternalDiscussionProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold font-sans">
              Internal Discussion
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">
              Collaboration thread for internal stakeholders
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-muted opacity-60">
          0 Comments
        </Badge>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Mock Conversation Thread */}
        <div className="space-y-6 opacity-40 grayscale-[0.5] select-none pointer-events-none">
          <div className="flex gap-4">
            <Avatar className="h-9 w-9 border">
              <AvatarFallback className="text-xs font-bold">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  John Doe
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Yesterday, 4:12 PM
                </span>
              </div>
              <div className="bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-border/20 max-w-[80%]">
                <p className="text-sm font-medium leading-relaxed">
                  I've reviewed the initial report. Looks like we need to
                  prioritize the technical assessment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-4">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={requester?.avatar} />
              <AvatarFallback className="text-xs font-bold">SY</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col items-end space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Yesterday, 4:45 PM
                </span>
                <span className="text-xs font-bold text-foreground">
                  Assistant Manager
                </span>
              </div>
              <div className="bg-primary/5 p-3 rounded-2xl rounded-tr-none border border-primary/20 max-w-[80%]">
                <p className="text-sm font-medium leading-relaxed text-primary/80">
                  Affirmative. I will coordinate with the requester for
                  additional documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Overlay with Action */}
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative h-16 w-16 rounded-full bg-white dark:bg-background border border-border/40 shadow-xl flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div className="space-y-1 max-w-[280px]">
            <h3 className="text-base font-bold text-foreground font-sans">
              Conversation Awaiting
            </h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              This discussion module is currently in development. Soon you'll be
              able to collaborate directly on this case.
            </p>
          </div>
        </div>

        {/* Mock Input Area */}
        <div className="relative mt-4">
          <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-muted/[0.02] to-transparent pointer-events-none" />
          <div className="bg-white dark:bg-background border border-border/40 rounded-2xl p-4 shadow-lg flex items-end gap-3 opacity-60">
            <div className="flex-1 bg-muted/20 h-10 rounded-xl animate-pulse" />
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl"
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl bg-primary"
              disabled
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
