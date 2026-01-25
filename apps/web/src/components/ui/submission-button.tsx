import { Loader2 } from 'lucide-react'
import { Button } from './button'

function SubmissionButton({
  isPending,
  ...props
}: React.ComponentProps<'button'> & { isPending?: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      data-slot="submission-button"
      {...props}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : props.children}
    </Button>
  )
}

export { SubmissionButton }
