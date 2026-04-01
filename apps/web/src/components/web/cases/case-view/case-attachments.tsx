import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Paperclip,
  FileTextIcon,
  Trash2,
  Download,
  Loader2,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useParams } from '@tanstack/react-router'
import {
  useCaseAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} from '@/lib/queries/case-attachments.query'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'
import { Button } from '@/components/ui/button'

export function CaseAttachments() {
  const { caseId } = useParams({ from: '/_esm/cases/$caseId/' })
  const { data: attachments, isLoading } = useCaseAttachmentsQuery(caseId)
  const uploadMutation = useUploadAttachmentMutation(caseId)
  const deleteMutation = useDeleteAttachmentMutation(caseId)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        uploadMutation.mutate(file)
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        uploadMutation.mutate(file)
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Attachments
          </CardTitle>
          <CardDescription>
            Manage and review case documentation
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-background text-xs font-medium"
          >
            PDF
          </Badge>
          <Badge
            variant="outline"
            className="bg-background text-xs font-medium"
          >
            DOCX
          </Badge>
          <Badge
            variant="outline"
            className="bg-background text-xs font-medium"
          >
            EXCEL
          </Badge>
          <Badge
            variant="outline"
            className="bg-background text-xs font-medium"
          >
            IMAGE
          </Badge>
          {/* <Badge
            variant="outline"
            className="bg-background text-xs font-medium opacity-40"
          >
            IMG
          </Badge> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        {/* Refined Dropzone */}
        <div
          className={cn(
            'group relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4',
            isDragging
              ? 'border-primary bg-primary/5 scale-[0.99]'
              : 'border-border/40 hover:border-primary/40 hover:bg-primary/[0.01]',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
            {uploadMutation.isPending ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Paperclip className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium text-foreground font-sans">
              Upload Documentation
            </h3>
            <p className="text-xs text-muted-foreground font-medium max-w-[240px]">
              Drag and drop your files here or{' '}
              <span
                className="text-primary font-medium cursor-pointer hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                browse files
              </span>
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground/40 uppercase tracking-widest">
              Maximum file size: 25MB
            </p>
          </div>
        </div>

        {/* Attachments List */}
        {attachments && attachments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                Recent Files ({attachments.length})
              </h4>
            </div>
            <div className="grid gap-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="group/item flex items-center justify-between p-3 rounded-2xl border border-border/40 hover:border-primary/20 hover:bg-primary/[0.01] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                      <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[400px]">
                        {attachment.originalName}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                        <span>{formatFileSize(attachment.size)}</span>
                        <span>•</span>
                        <span>
                          {formatDate(new Date(attachment.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"
                      asChild
                    >
                      <a
                        href={attachment.storagePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg"
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to delete this attachment?',
                          )
                        ) {
                          deleteMutation.mutate(attachment.id)
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === attachment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State when loading finishes but no attachments */}
        {!isLoading &&
          attachments?.length === 0 &&
          !uploadMutation.isPending && (
            <div className="py-4 text-center">
              <p className="text-xs font-medium text-muted-foreground italic">
                No documentation uploaded yet.
              </p>
            </div>
          )}

        {/* Information Callout */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 rounded-2xl p-4 flex gap-3 items-start">
          <div className="p-1 rounded-md bg-white dark:bg-background shadow-sm mt-0.5">
            <FileTextIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 leading-none">
              Security Note
            </p>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80 font-medium leading-relaxed">
              All uploaded assets are encrypted and scanned for vulnerabilities
              before being saved to the secure repository.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
