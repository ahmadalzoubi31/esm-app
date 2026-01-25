import { CardDescription, CardTitle } from '@/components/ui/card'

interface TabTitleProps {
  title: string
  description: string
}

export default function TabTitle({ title, description }: TabTitleProps) {
  return (
    <div className="space-y-1.5">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </div>
  )
}
