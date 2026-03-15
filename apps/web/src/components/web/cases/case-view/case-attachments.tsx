import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Paperclip, FileTextIcon } from 'lucide-react'

export function CaseAttachments() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Paperclip className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold font-sans">
              Attachments
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">
              Manage and review case documentation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-background text-xs font-bold"
          >
            PDF
          </Badge>
          <Badge
            variant="outline"
            className="bg-background text-xs font-bold"
          >
            DOCX
          </Badge>
          <Badge
            variant="outline"
            className="bg-background text-xs font-bold opacity-40"
          >
            IMG
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Refined Dropzone */}
        <div className="group relative border-2 border-dashed border-border/40 rounded-3xl p-12 transition-all hover:border-primary/40 hover:bg-primary/[0.01] flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
            <Paperclip className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">
              Upload Documentation
            </h3>
            <p className="text-xs text-muted-foreground font-medium max-w-[240px]">
              Drag and drop your files here or{' '}
              <span className="text-primary font-bold cursor-pointer hover:underline">
                browse files
              </span>
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
              Maximum file size: 25MB
            </p>
          </div>
        </div>

        {/* Information Callout */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 rounded-2xl p-4 flex gap-3 items-start">
          <div className="p-1 rounded-md bg-white dark:bg-background shadow-sm mt-0.5">
            <FileTextIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 leading-none">
              Security Note
            </p>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80 font-medium leading-relaxed">
              All uploaded assets are encrypted and scanned for
              vulnerabilities before being saved to the secure repository.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
