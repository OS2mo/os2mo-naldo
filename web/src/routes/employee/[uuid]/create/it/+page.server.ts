import type { Actions, RequestEvent } from "@sveltejs/kit"
import type { ItUserCreateInput } from "$lib/graphql/types"

export const actions: Actions = {
  default: async ({ request, params }: RequestEvent): Promise<ItUserCreateInput> => {
    const data = await request.formData()
    const itSystem = data.get("it-system")
    const accountName = data.get("account-name") as string
    const primary = data.get("primary") ? data.get("primary") : data.get("non-primary")
    // When mutator is ready
    const itSystemRole = data.get("it-system-role-uuid")
    const notes = data.get("notes") as string
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      person: params.uuid,
      itsystem: itSystem,
      user_key: accountName,
      primary: primary,
      ...(notes && { note: notes }),
      validity: { from: startDate, ...(endDate && { to: endDate }) },
    }
  },
}
