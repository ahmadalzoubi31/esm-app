import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CategoryBasicInfo } from '@/components/web/categories/category-form/category-basic-info'
import { SideBarForm } from '@/components/web/categories/category-form/sidebar-form'
import { useUpdateCategoryMutation } from '@/lib/mutations/categories.mutation'
import { CategoryDto, CategoryWriteSchema } from '@repo/shared'
import { error } from 'console'
import { getCategoryFn } from '@/server/category'

export const Route = createFileRoute('/_core/categories/$categoryId')({
  // checking if the user has access to view/edit the category can be done here in the future
  loader: async ({ params }) => {
    const category = await getCategoryFn({ data: { id: params.categoryId } })
    return { category }
  },
  component: EditCategoryPage,
})

function EditCategoryPage() {
  const { categoryId } = Route.useParams()
  const { category } = Route.useLoaderData()
  const navigate = useNavigate()

  // const {
  //   data: category,
  //   isLoading: categoryLoading,
  //   error,
  // } = useCategoryQuery(categoryId)
  const updateMutation = useUpdateCategoryMutation()

  const form = useForm({
    defaultValues: {
      name: category.name || '',
      description: category.description || '',
      parentId: category.parent?.id || '',
      isActive: category.isActive,
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
      await updateMutation.mutateAsync({
        id: categoryId,
        data: value,
      })
      navigate({ to: '/categories' })
    },
  })

  if (categoryLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-2">
        <div className="text-lg font-semibold">Category not found</div>
        <div className="text-muted-foreground">
          The category you are looking for does not exist or you don't have
          permission to view it.
        </div>
      </div>
    )
  }

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
          Edit category
          <div className="text-muted-foreground text-sm font-normal">
            Update category details
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
