import type { Actions, RequestEvent } from "@sveltejs/kit"
import type { RoleCreateInput } from "$lib/graphql/types"

export const actions: Actions = {
  default: async ({ request, params }: RequestEvent): Promise<RoleCreateInput> => {
    const data = await request.formData()
    const employeeUuid = data.get("employee-uuid")
    const roleType = data.get("role-type")
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      org_unit: params.uuid,
      person: employeeUuid,
      role_type: roleType,
      validity: { from: startDate, ...(endDate && { to: endDate }) },
    }
  },
}
