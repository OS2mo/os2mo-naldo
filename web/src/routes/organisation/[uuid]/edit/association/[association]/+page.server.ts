import type { AssociationUpdateInput } from "$lib/graphql/types"
import type { Actions, RequestEvent } from "@sveltejs/kit"

export const actions: Actions = {
  default: async ({
    request,
    params,
  }: RequestEvent): Promise<AssociationUpdateInput> => {
    const data = await request.formData()
    const associationType = data.get("association-type")
    const employeeUuid = data.get("employee-uuid")
    const primary = data.get("primary")
    const substitute = data.get("substitute")
    const tradeUnion = data.get("trade-union")
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      uuid: params.association,
      validity: { from: startDate, ...(endDate && { to: endDate }) },
      // FIX: This is a quick fix, since if we don't send the org_unit, the owner role won't work correctly.
      // Problem is, for e.g. terminate, this is not possible, since the mutator doesn't allow `org_unit` in input.
      org_unit: params.uuid,
      ...(associationType && { association_type: associationType }),
      ...(employeeUuid && { employee: employeeUuid }),
      ...(primary && { primary: primary }),
      ...(substitute && { substitute: substitute }),
      ...(tradeUnion && { trade_union: tradeUnion }),
    }
  },
}
