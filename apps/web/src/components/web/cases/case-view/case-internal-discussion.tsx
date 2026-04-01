import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Send, Lock, Globe } from 'lucide-react'
import { useCaseCommentsQuery } from '@/lib/queries/case-comments.query'
import { useCreateCaseCommentMutation } from '@/lib/mutations/cases.mutation'
import { Separator } from '@/components/ui/separator'
import { UserSchema } from '@repo/shared'
import { formatDate } from '@/lib/format-date'

interface CaseInternalDiscussionProps {
  caseId: string
  requester?: UserSchema
}

function getInitials(
  user?: Pick<
    UserSchema,
    'firstName' | 'lastName' | 'username' | 'displayName'
  >,
): string {
  if (!user) return '??'
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }
  if (user.username) return user.username.slice(0, 2).toUpperCase()
  return '??'
}

function getDisplayName(
  user?: Pick<
    UserSchema,
    'firstName' | 'lastName' | 'username' | 'displayName'
  >,
): string {
  if (!user) return 'Unknown'
  if (user.displayName) return user.displayName
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`
  if (user.username) return user.username
  return 'Unknown'
}

export function CaseInternalDiscussion({
  caseId,
  requester,
}: CaseInternalDiscussionProps) {
  const [body, setBody] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: comments = [], isLoading } = useCaseCommentsQuery(caseId)
  const { mutate: createComment, isPending } =
    useCreateCaseCommentMutation(caseId)

  // Scroll to latest comment
  // useEffect(() => {
  //   if (comments.length > 0) {
  //     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  //   }
  // }, [comments.length])

  const handleSubmit = () => {
    if (!body.trim() || isPending) return
    createComment(
      { body: body.trim(), isPrivate },
      { onSuccess: () => setBody('') },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Internal Discussion
          </CardTitle>
          <CardDescription>
            Collaboration thread for internal stakeholders
          </CardDescription>
        </div>
        <Badge variant="secondary" className="tabular-nums">
          {isLoading
            ? '—'
            : `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />
        {/* Comment Thread */}
        <div className="px-6 py-4 space-y-5 max-h-[420px] overflow-y-auto">
          {isLoading ? (
            // Loading Skeleton
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-14 w-[75%] rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative h-14 w-14 rounded-full bg-background border border-border/40 shadow-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="space-y-1 max-w-[260px]">
                <h3 className="text-sm font-medium text-foreground font-sans">
                  No comments yet
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Be the first to start the internal discussion on this case.
                </p>
              </div>
            </div>
          ) : (
            // Rendered Comments
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {getInitials(requester)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-foreground">
                        {getDisplayName(requester)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(new Date(comment.createdAt))}
                      </span>
                      {comment.isPrivate ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-1.5 py-0.5">
                          <Lock className="h-2.5 w-2.5" />
                          Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-1.5 py-0.5">
                          <Globe className="h-2.5 w-2.5" />
                          Shared
                        </span>
                      )}
                    </div>
                    <div className="bg-muted/40 px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-border/30 max-w-[85%]">
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-muted/20 px-4 py-3 space-y-2.5">
          {/* Privacy Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border transition-all ${
                isPrivate
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-300 dark:border-amber-700'
                  : 'text-muted-foreground border-transparent hover:border-border'
              }`}
            >
              <Lock className="h-3 w-3" />
              Private
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border transition-all ${
                !isPrivate
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-300 dark:border-emerald-700'
                  : 'text-muted-foreground border-transparent hover:border-border'
              }`}
            >
              <Globe className="h-3 w-3" />
              Shared with Requester
            </button>
          </div>

          {/* Textarea + Send */}
          <div className="flex gap-2 items-end">
            <Textarea
              id="case-comment-input"
              placeholder="Write a comment… (Ctrl+Enter to send)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="resize-none flex-1 text-sm bg-background rounded-xl border-border/50 focus-visible:ring-primary/30 min-h-[60px]"
            />
            <Button
              id="case-comment-send"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl"
              disabled={!body.trim() || isPending}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isPrivate
              ? 'Only internal team members will see this comment.'
              : 'This comment will be visible to the requester.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
