import type { Actions, RequestEvent } from "@sveltejs/kit"
import type { EmployeeTerminateInput } from "$lib/graphql/types"

export const actions: Actions = {
  default: async ({
    request,
    params,
  }: RequestEvent): Promise<EmployeeTerminateInput> => {
    const data = await request.formData()
    const toDate = data.get("to")

    return {
      uuid: params.uuid,
      to: toDate,
    }
  },
}