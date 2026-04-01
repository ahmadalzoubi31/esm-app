import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CategoryBasicInfo } from '@/components/web/categories/category-form/category-basic-info'
import { SideBarForm } from '@/components/web/categories/category-form/sidebar-form'
import { useCreateCategoryMutation } from '@/lib/mutations'
import { CategoryDto, CategoryWriteSchema } from '@repo/shared'

export const Route = createFileRoute('/_core/categories/create')({
  component: CreateCategoryPage,
})

function CreateCategoryPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCategoryMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      tier: 1,
      parentId: '',
      isActive: true,
    } as CategoryDto,
    validators: {
      onSubmit: CategoryWriteSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.parentId) {
        value.tier = 2
      } else {
        value.tier = 1
        delete value.parentId
      }
      await createMutation.mutateAsync(value)
      navigate({ to: '/categories' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/categories' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Create category
          <div className="text-muted-foreground text-sm font-normal">
            Create a new case category
          </div>
        </div>
      </div>

      <div className="">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mx-auto pb-4 pt-4">
            <div className="space-y-6 lg:col-span-3">
              <CategoryBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
