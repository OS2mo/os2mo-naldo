<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import { ituserInfo } from "$lib/stores/ituserInfoStore"
  import { rolebindingInfo } from "$lib/stores/rolebindingInfoStore"
  import DateInput from "$lib/components/forms/shared/DateInput.svelte"
  import Error from "$lib/components/alerts/Error.svelte"
  import Input from "$lib/components/forms/shared/Input.svelte"
  import Select from "$lib/components/forms/shared/Select.svelte"
  import CircleButton from "$lib/components/shared/CircleButton.svelte"
  import OnboardingFormButtons from "$lib/components/userflow/OnboardingFormButtons.svelte"
  import { step } from "$lib/stores/stepStore"
  import { graphQLClient } from "$lib/util/http"
  import {
    ItSystemsAndPrimaryDocument,
    GetItSystemRolesDocument,
  } from "./query.generated"
  import { gql } from "graphql-request"
  import { page } from "$app/stores"
  import { date } from "$lib/stores/date"
  import { getClassByUserKey } from "$lib/util/getClasses"
  import { getITSystemNames, type UnpackedClass } from "$lib/util/helpers"
  import { form, field } from "svelte-forms"
  import { required } from "svelte-forms/validators"
  import Skeleton from "$lib/components/forms/shared/Skeleton.svelte"
  import TextArea from "$lib/components/forms/shared/TextArea.svelte"
  import { env } from "$env/dynamic/public"
  import ItUserCheckbox from "./ItUserCheckbox.svelte"
  import Icon from "@iconify/svelte"
  import removeRounded from "@iconify/icons-material-symbols/remove-rounded"
  import addRounded from "@iconify/icons-material-symbols/add-rounded"
  import { onMount } from "svelte"

  gql`
    query ItSystemsAndPrimary($primaryClass: String!, $currentDate: DateTime!) {
      itsystems {
        objects {
          current(at: $currentDate) {
            name
            uuid
          }
        }
      }
      classes(
        filter: { user_keys: [$primaryClass, "non-primary"], from_date: $currentDate }
      ) {
        objects {
          validities {
            uuid
            user_key
            name
          }
        }
      }
    }
    query GetITSystemRoles($itSystemUuid: [UUID!], $currentDate: DateTime!) {
      classes(
        filter: {
          facet: { user_keys: "role" }
          it_system: { uuids: $itSystemUuid }
          from_date: $currentDate
        }
      ) {
        objects {
          validities {
            uuid
            user_key
            name
          }
        }
      }
    }
  `

  const fromDate = field("from", "", [required()])
  const itSystemField = field("it_system", "", [required()])
  const accountName = field("accountName", "", [required()])
  const svelteForm = form(fromDate, itSystemField, accountName)
  let rolebindingFromDate: string
  let rolebindingToDate: string

  const validateForm = async () => {
    await svelteForm.validate()
    const ituserValid = $svelteForm.valid
    let rolebindingsValid = true

    if (ituserValid) {
      const hasFilledRolebinding = $rolebindingInfo.some((rb) => rb.role?.uuid)

      if (hasFilledRolebinding) {
        rolebindingsValid = rolebindingInfo.validateAll()
      }
    }

    if (ituserValid && rolebindingsValid) {
      ituserInfo.isValid(true)
      step.updateStep("inc")
    } else {
      ituserInfo.isValid(false)
    }
  }
  let itSystemRoles: UnpackedClass | undefined

  const fetchItSystemRoles = async (itSystemUuid: string | undefined | null) => {
    const res = await graphQLClient().request(GetItSystemRolesDocument, {
      itSystemUuid: itSystemUuid,
      currentDate: $date,
    })
    itSystemRoles = res.classes?.objects
      .map((cls) => cls.validities[0])
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  }

  onMount(async () => {
    if ($ituserInfo.itSystem?.uuid) {
      fetchItSystemRoles($ituserInfo.itSystem.uuid)
    }
  })
  // Update all rolebinding dates, when dates change
  $: if (rolebindingFromDate) {
    rolebindingInfo.updateRolebindingDates(rolebindingFromDate, "fromDate")
  }
  $: if (rolebindingToDate) {
    rolebindingInfo.updateRolebindingDates(rolebindingToDate, "toDate")
  }
</script>

<form on:submit|preventDefault={async () => await validateForm()}>
  {#await graphQLClient().request( ItSystemsAndPrimaryDocument, { uuid: $page.params.uuid, primaryClass: env.PUBLIC_PRIMARY_CLASS_USER_KEY || "primary", currentDate: $date } )}
    <div class="sm:w-full md:w-3/4 xl:w-1/2 bg-slate-100 rounded">
      <div class="p-8">
        <div class="flex flex-row gap-6">
          <Skeleton extra_classes="basis-1/2" />
          <Skeleton extra_classes="basis-1/2" />
        </div>
        <div class="flex flex-row gap-6">
          <Skeleton extra_classes="basis-1/2" />
          <Skeleton extra_classes="basis-1/2" />
        </div>
        <Skeleton />
      </div>
    </div>
  {:then data}
    {@const itSystems = data.itsystems.objects}
    {@const classes = data.classes.objects}
    {@const primaryClass = getClassByUserKey(
      classes,
      env.PUBLIC_PRIMARY_CLASS_USER_KEY || "primary"
    )}

    <div class="sm:w-full md:w-3/4 xl:w-1/2 bg-slate-100 rounded">
      <div class="p-8">
        <div class="flex flex-row gap-6">
          <DateInput
            startValue={$date}
            bind:value={$ituserInfo.fromDate}
            bind:validationValue={$fromDate.value}
            errors={$fromDate.errors}
            title={capital($_("date.start_date"))}
            id="from"
            required={true}
          />
          <DateInput
            bind:value={$ituserInfo.toDate}
            title={capital($_("date.end_date"))}
            id="to"
          />
        </div>
        <div class="flex flex-row gap-6">
          <Select
            title={capital($_("it_system"))}
            id="it-system"
            bind:value={$ituserInfo.itSystem}
            bind:name={$itSystemField.value}
            errors={$itSystemField.errors}
            on:change={() => {
              fetchItSystemRoles($ituserInfo.itSystem.uuid)
            }}
            iterable={getITSystemNames(itSystems)}
            extra_classes="basis-1/2"
            required={true}
          />
          <Input
            bind:value={$ituserInfo.userkey}
            bind:cprName={$accountName.value}
            errors={$accountName.errors}
            extra_classes="basis-1/2"
            title={capital($_("account_name"))}
            id="account-name"
            required={true}
          />
        </div>
        <div class="flex">
          <ItUserCheckbox
            id="primary"
            title={capital($_("primary"))}
            startValue={$ituserInfo.primary.uuid}
            value={primaryClass.uuid}
            on:change={() => {
              if ($ituserInfo.primary.uuid !== primaryClass.uuid) {
                $ituserInfo.primary = primaryClass
              } else {
                $ituserInfo.primary = getClassByUserKey(classes, "non-primary")
              }
            }}
          />
        </div>
        <TextArea
          title={capital($_("notes"))}
          id="notes"
          bind:value={$ituserInfo.notes}
        />
        <div class="divider p-0 m-0 mb-4 w-full" />
        <h4>{capital($_("rolebinding", { values: { n: 1 } }))}</h4>
        <div class="flex flex-row gap-6">
          <DateInput
            startValue={$date}
            bind:value={rolebindingFromDate}
            title={capital($_("date.start_date"))}
            id="rolebinding-from"
            min={$ituserInfo.fromDate}
            max={$ituserInfo.toDate}
          />
          <!-- FIX: If a to-date is set and another rolebinding is added afterwards, the to-dates are not aligned. -->
          <DateInput
            bind:value={rolebindingToDate}
            title={capital($_("date.end_date"))}
            min={rolebindingFromDate}
            max={$ituserInfo.toDate ? $ituserInfo.toDate : undefined}
            id="rolebinding-to"
          />
        </div>
        {#each $rolebindingInfo as rolebinding, index}
          {#if itSystemRoles && itSystemRoles.length}
            {#key itSystemRoles}
              <Select
                title={capital($_("role", { values: { n: 1 } }))}
                id="it-system-role-uuid"
                bind:value={rolebinding.role}
                iterable={itSystemRoles}
                errors={rolebinding.validated ? [] : ["required"]}
              />
            {/key}
          {:else}
            <Select
              title={capital($_("role", { values: { n: 1 } }))}
              id="it-system-role-uuid"
              extra_classes="basis-1/2"
              disabled
            />
          {/if}
          {#if $rolebindingInfo.length > 1}
            <CircleButton
              on:click={() => {
                rolebindingInfo.removeRolebinding(index)
              }}
              icon={removeRounded}
            />
          {/if}
          {#if index === $rolebindingInfo.length - 1}
            <CircleButton
              on:click={() =>
                rolebindingInfo.addRolebinding(rolebindingFromDate, rolebindingToDate)}
              icon={addRounded}
              extraClasses="mb-4"
            />
          {:else}
            <div class="divider p-0 m-0 my-2 w-full" />
          {/if}
        {/each}
      </div>
    </div>
    <OnboardingFormButtons />
    <Error />
  {/await}
</form>
