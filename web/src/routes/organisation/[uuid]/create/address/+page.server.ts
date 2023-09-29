import type { Actions, RequestEvent } from "@sveltejs/kit"
import type { AddressCreateInput } from "$lib/graphql/types"

export const actions: Actions = {
  default: async ({ request, params }: RequestEvent): Promise<AddressCreateInput> => {
    const data = await request.formData()
    const addressType = data.get("address-type-uuid")
    const visibility = data.get("visibility")
    const value = data.get("value") as string
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      uuid: params.address,
      org_unit: params.uuid,
      address_type: addressType,
      value: value,
      ...(visibility && { visibility: visibility }),
      validity: { from: startDate, ...(endDate && { to: endDate }) },
    }
  },
}
