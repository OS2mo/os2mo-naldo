import type { ClassCreateInput } from "$lib/graphql/types"
import type { Actions, RequestEvent } from "@sveltejs/kit"

export const actions: Actions = {
  default: async ({ request, params }: RequestEvent): Promise<ClassCreateInput> => {
    const data = await request.formData()
    const name = data.get("name") as string
    const userKey = data.get("user-key") as string
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      facet_uuid: params.facet,
      name: name,
      user_key: userKey,
      validity: { from: startDate, ...(endDate && { to: endDate }) },
    }
  },
}
