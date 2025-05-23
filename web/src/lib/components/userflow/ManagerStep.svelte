<script lang="ts">
  import { step } from "$lib/stores/stepStore"
  import { managerInfo } from "$lib/stores/managerInfoStore"
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import DateInput from "$lib/components/forms/shared/DateInput.svelte"
  import Error from "$lib/components/alerts/Error.svelte"
  import Select from "$lib/components/forms/shared/Select.svelte"
  import OnboardingFormButtons from "$lib/components/userflow/OnboardingFormButtons.svelte"
  import { graphQLClient } from "$lib/util/http"
  import { gql } from "graphql-request"
  import { ManagerFacetsDocument } from "./query.generated"
  import { date } from "$lib/stores/date"
  import { getClassesByFacetUserKey } from "$lib/util/getClasses"
  import { form, field } from "svelte-forms"
  import { required } from "svelte-forms/validators"
  import Search from "$lib/components/search/Search.svelte"
  import Breadcrumbs from "$lib/components/org/Breadcrumbs.svelte"
  import Skeleton from "$lib/components/forms/shared/Skeleton.svelte"
  import SelectMultiple from "$lib/components/forms/shared/SelectMultiple.svelte"
  import { getValidities } from "$lib/util/helpers"

  gql`
    query ManagerFacets($currentDate: DateTime!) {
      facets(
        filter: { user_keys: ["manager_type", "manager_level", "responsibility"] }
      ) {
        objects {
          validities {
            uuid
            user_key
            classes(filter: { from_date: $currentDate }) {
              name
              uuid
              user_key
            }
          }
        }
      }
    }
  `
  // Logic for updating datepicker intervals
  let validities: {
    from: string | undefined | null
    to: string | undefined | null
  } = { from: null, to: null }

  $: if ($managerInfo.orgUnit?.uuid) {
    ;(async () => {
      validities = await getValidities(
        $managerInfo.orgUnit ? $managerInfo.orgUnit.uuid : ""
      )
    })()
  } else {
    validities = { from: null, to: null }
  }

  const fromDate = field("from", "", [required()])
  const orgUnit = field("org_unit", "", [required()])
  const managerType = field("manager_type", "", [required()])
  const managerLevel = field("manager_level", "", [required()])
  const responsibilities = field("responsibilities", undefined, [required()])
  const svelteForm = form(
    fromDate,
    orgUnit,
    managerType,
    managerLevel,
    responsibilities
  )

  const validateForm = async () => {
    await svelteForm.validate()
    if ($svelteForm.valid) {
      managerInfo.isValid(true)
      step.updateStep("inc")
    } else {
      managerInfo.isValid(false)
    }
  }
</script>

<form on:submit|preventDefault={async () => await validateForm()}>
  {#await graphQLClient().request(ManagerFacetsDocument, { currentDate: $date })}
    <div class="sm:w-full md:w-3/4 xl:w-1/2 bg-slate-100 rounded">
      <div class="p-8">
        <div class="flex flex-row gap-6">
          <Skeleton extra_classes="basis-1/2" />
          <Skeleton extra_classes="basis-1/2" />
        </div>
        <Skeleton />
        <div class="flex flex-row gap-6">
          <Skeleton extra_classes="basis-1/2" />
          <Skeleton extra_classes="basis-1/2" />
        </div>
        <Skeleton />
      </div>
    </div>
  {:then data}
    {@const facets = data.facets.objects}

    <div class="sm:w-full md:w-3/4 xl:w-1/2 bg-slate-100 rounded">
      <div class="p-8">
        <div class="flex flex-row gap-6">
          <DateInput
            startValue={$date}
            bind:value={$managerInfo.fromDate}
            bind:validationValue={$fromDate.value}
            errors={$fromDate.errors}
            title={capital($_("date.start_date"))}
            id="from"
            min={validities.from}
            max={$managerInfo.toDate ? $managerInfo.toDate : validities.to}
            required={true}
          />
          <DateInput
            bind:value={$managerInfo.toDate}
            title={capital($_("date.end_date"))}
            id="to"
            min={$fromDate.value ? $fromDate.value : validities.from}
            max={validities.to}
          />
        </div>
        <Search
          type="org-unit"
          bind:value={$managerInfo.orgUnit}
          on:clear={() => ($orgUnit.value = "")}
          bind:name={$orgUnit.value}
          errors={$orgUnit.errors}
          required={true}
        />
        <Breadcrumbs orgUnit={$managerInfo.orgUnit} />
        <div class="flex flex-row gap-6">
          <Select
            title={capital($_("manager_type"))}
            id="manager-type"
            bind:value={$managerInfo.managerType}
            bind:name={$managerType.value}
            errors={$managerType.errors}
            iterable={getClassesByFacetUserKey(facets, "manager_type")}
            extra_classes="basis-1/2"
            required={true}
          />
          <Select
            title={capital($_("manager_level"))}
            id="manager-level"
            bind:value={$managerInfo.managerLevel}
            bind:name={$managerLevel.value}
            errors={$managerLevel.errors}
            iterable={getClassesByFacetUserKey(facets, "manager_level")}
            extra_classes="basis-1/2"
            required={true}
          />
        </div>
        <SelectMultiple
          bind:value={$managerInfo.responsibilities}
          bind:name={$responsibilities.value}
          errors={$responsibilities.errors}
          on:clear={() => ($responsibilities.value = undefined)}
          title={capital($_("manager_responsibility"))}
          id="responsibility"
          iterable={getClassesByFacetUserKey(facets, "responsibility")}
          required={true}
        />
      </div>
    </div>
    <OnboardingFormButtons />
    <Error />
  {/await}
</form>
