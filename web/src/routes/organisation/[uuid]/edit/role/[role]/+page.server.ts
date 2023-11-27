import type { Actions, RequestEvent } from "@sveltejs/kit"
import type { RoleUpdateInput } from "$lib/graphql/types"

export const actions: Actions = {
  default: async ({ request, params }: RequestEvent): Promise<RoleUpdateInput> => {
    const data = await request.formData()
    const orgUnitUuid = data.get("org-unit-uuid")
    const roleType = data.get("role-type")
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      uuid: params.role,
      org_unit: orgUnitUuid,
      role_type: roleType,
      validity: { from: startDate, ...(endDate && { to: endDate }) },
    }
  },
}