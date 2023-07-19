import type { Actions, RequestEvent } from "@sveltejs/kit"
import type { KleTerminateInput } from "$lib/graphql/types"

export const actions: Actions = {
  default: async ({ request, params }: RequestEvent): Promise<KleTerminateInput> => {
    const data = await request.formData()
    const toDate = data.get("to")

    return {
      uuid: params.kle,
      to: toDate,
    }
  },
}
