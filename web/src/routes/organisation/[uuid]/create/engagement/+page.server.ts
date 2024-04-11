import type { EngagementCreateInput } from "$lib/graphql/types"
import type { Actions, RequestEvent } from "@sveltejs/kit"

export const actions: Actions = {
  default: async ({
    request,
    params,
  }: RequestEvent): Promise<EngagementCreateInput> => {
    const data = await request.formData()
    const employeeUuid = data.get("employee-uuid")
    const userKey = data.get("user-key") as string
    const engagementType = data.get("engagement-type")
    const jobFunction = data.get("job-function")
    const primary = data.get("primary")
    const startDate = data.get("from")
    const endDate = data.get("to")

    return {
      org_unit: params.uuid,
      person: employeeUuid,
      ...(userKey && { user_key: userKey }),
      engagement_type: engagementType,
      job_function: jobFunction,
      ...(primary && { primary: primary }),
      validity: { from: startDate, ...(endDate && { to: endDate }) },
    }
  },
}
