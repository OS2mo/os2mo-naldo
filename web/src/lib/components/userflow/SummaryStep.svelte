<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/utils/helpers"
  import { date } from "$lib/stores/date"
  import { gql } from "graphql-request"
  import Error from "$lib/components/alerts/Error.svelte"
  import Button from "$lib/components/shared/Button.svelte"
  import EmployeeSummary from "$lib/components/userflow/EmployeeSummary.svelte"
  import EngagementSummary from "$lib/components/userflow/EngagementSummary.svelte"
  import ItuserSummary from "$lib/components/userflow/ItuserSummary.svelte"
  import ManagerSummary from "$lib/components/userflow/ManagerSummary.svelte"
  import AddressSummary from "$lib/components/userflow/AddressSummary.svelte"
  import { success, error } from "$lib/stores/alert"
  import { employeeInfo } from "$lib/stores/employeeInfoStore"
  import { engagementInfo } from "$lib/stores/engagementInfoStore"
  import { ituserInfo } from "$lib/stores/ituserInfoStore"
  import { managerInfo } from "$lib/stores/managerInfoStore"
  import { addressInfo } from "$lib/stores/addressInfoStore"
  import { graphQLClient } from "$lib/http/client"
  import { UserFlowCreateDocument } from "./query.generated"
  import { resetUserflowStores } from "$lib/stores/resetStores"
  import { buildUserflowPayload, reserveUserflowUuids } from "$lib/userflow/mappers"

  gql`
    mutation UserFlowCreate(
      $employeeInput: EmployeeCreateInput!
      $engagementInput: [EngagementCreateInput!]!
      $ituserInput: [ITUserCreateInput!]!
      $rolebindingInput: [RoleBindingCreateInput!]!
      $managerInput: [ManagerCreateInput!]!
      $addressInput: [AddressCreateInput!]!
      $date: DateTime!
    ) {
      employee_create(input: $employeeInput) {
        current(at: $date) {
          uuid
          name
        }
      }
      engagements_create(input: $engagementInput) {
        current(at: $date) {
          uuid
        }
      }
      itusers_create(input: $ituserInput) {
        current(at: $date) {
          uuid
        }
      }
      rolebindings_create(input: $rolebindingInput) {
        current(at: $date) {
          uuid
        }
      }
      managers_create(input: $managerInput) {
        current(at: $date) {
          uuid
        }
      }
      addresses_create(input: $addressInput) {
        current(at: $date) {
          uuid
        }
      }
    }
  `

  // An earlier-approved tab may have been edited into invalidity since; this
  // moves it to the warning list rather than submitting it.
  employeeInfo.revalidate()
  engagementInfo.revalidate()
  ituserInfo.revalidate()
  managerInfo.revalidate()
  addressInfo.revalidate()

  // Reactive, not a one-shot read: buildUserflowPayload pairs uuids to itusers
  // by position, so both must come from the same $ituserInfo.
  $: uuids = reserveUserflowUuids($ituserInfo.map((item) => item._key))

  $: ({ payload } = buildUserflowPayload(
    {
      employee: $employeeInfo,
      engagements: $engagementInfo,
      itusers: $ituserInfo,
      managers: $managerInfo,
      addresses: $addressInfo,
    },
    uuids
  ))

  const submitForm = async () => {
    try {
      const mutation = await graphQLClient().request(UserFlowCreateDocument, {
        ...payload,
        date: $date,
      })
      $success = {
        message: capital(
          $_("success_create", {
            values: {
              name: mutation.employee_create.current?.name,
            },
          })
        ),
        uuid: mutation.employee_create.current?.uuid,
        type: "employee",
      }
      resetUserflowStores()
    } catch (err) {
      $error = { message: err }
    }
  }
</script>

<div class="sm:w-full md:w-3/4 xl:w-1/2 bg-base-200 rounded-sm">
  <div class="p-8 space-y-5">
    <EmployeeSummary />
    <EngagementSummary />
    <ItuserSummary />
    <ManagerSummary />
    <AddressSummary />
  </div>
</div>
<div class="sm:w-full md:w-3/4 xl:w-1/2 flex justify-between py-6 gap-4">
  <Button
    type="submit"
    title={capital($_("submit"))}
    disabled={!$employeeInfo.validated}
    on:click={submitForm}
  />
  <Button
    type="button"
    title={capital($_("start_over"))}
    outline={true}
    on:click={() => resetUserflowStores()}
  />
</div>
<Error />
