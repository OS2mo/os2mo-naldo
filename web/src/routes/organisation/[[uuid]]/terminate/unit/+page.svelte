<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import DateInput from "$lib/components/forms/shared/DateInput.svelte"
  import Button from "$lib/components/shared/Button.svelte"
  import Error from "$lib/components/alerts/Error.svelte"
  import { enhance } from "$app/forms"
  import type { SubmitFunction } from "./$types"
  import { success, error } from "$lib/stores/alert"
  import { graphQLClient } from "$lib/util/http"
  import { OrgUnitDocument, TerminateOrgUnitDocument } from "./query.generated"
  import { gql } from "graphql-request"
  import { page } from "$app/stores"
  import { date } from "$lib/stores/date"
  import Search from "$lib/components/search/Search.svelte"
  import { getMinMaxValidities } from "$lib/util/helpers"
  import { form, field } from "svelte-forms"
  import { required } from "svelte-forms/validators"
  import Breadcrumbs from "$lib/components/org/Breadcrumbs.svelte"
  import Skeleton from "$lib/components/forms/shared/Skeleton.svelte"

  let selectedOrgUnit: {
    uuid: string
    name: string
  }

  const toDate = field("to", "", [required()])
  const orgUnitField = field("org_unit", "", [required()])
  const svelteForm = form(toDate, orgUnitField)

  gql`
    query OrgUnit($uuid: [UUID!], $currentDate: DateTime!) {
      org_units(filter: { uuids: $uuid }) {
        objects {
          current(at: $currentDate) {
            uuid
            name
            parent {
              validity {
                from
                to
              }
            }
          }
        }
      }
    }

    mutation TerminateOrgUnit(
      $input: OrganisationUnitTerminateInput!
      $date: DateTime!
    ) {
      org_unit_terminate(input: $input) {
        current(at: $date) {
          uuid
          name
        }
      }
    }
  `
  const handler: SubmitFunction =
    () =>
    async ({ result }) => {
      // Await the validation, before we continue
      await svelteForm.validate()
      if ($svelteForm.valid) {
        if (result.type === "success" && result.data) {
          try {
            const mutation = await graphQLClient().request(TerminateOrgUnitDocument, {
              input: result.data,
              date: result.data.to,
            })

            $success = {
              message: capital(
                $_("success_terminate", {
                  values: {
                    name: mutation.org_unit_terminate.current?.name,
                  },
                })
              ),
              uuid: mutation.org_unit_terminate.current?.uuid,
              type: "organisation",
            }
          } catch (err) {
            $error = { message: err }
          }
        }
      }
    }
</script>

<title
  >{capital(
    $_("terminate_item", {
      values: { item: $_("org_unit", { values: { n: 1 } }) },
    })
  )} | OS2mo</title
>

<div class="flex align-center px-6 pt-6 pb-4">
  <h3 class="flex-1">
    {capital(
      $_("terminate_item", {
        values: { item: $_("org_unit", { values: { n: 1 } }) },
      })
    )}
  </h3>
</div>

<div class="divider p-0 m-0 mb-4 w-full" />
<!-- TODO: Fix this when: https://redmine.magenta.dk/issues/58621 is done -->
<!-- We can't use getMinMaxValidities since `parent` can't be a list, or it'll crash -->
<!-- Update dates depending on chosen org_unit -->
<form method="post" class="mx-6" use:enhance={handler}>
  <div class="sm:w-full md:w-3/4 xl:w-1/2 bg-slate-100 rounded">
    <div class="p-8">
      <DateInput
        startValue={$date}
        bind:value={$toDate.value}
        title={capital($_("date.end_date"))}
        id="to"
        min={undefined}
        max={undefined}
        required={true}
      />
      {#if $page.params.uuid}
        {#await graphQLClient().request( OrgUnitDocument, { uuid: $page.params.uuid, currentDate: $date } ) then data}
          {@const orgUnit = data.org_units.objects[0].current}
          <Search
            type="org-unit"
            title="{capital($_('specify'))} {$_('unit', { values: { n: 1 } })}"
            startValue={{
              uuid: orgUnit?.uuid ? orgUnit.uuid : undefined,
              name: orgUnit?.name ? orgUnit.name : "",
            }}
            bind:name={$orgUnitField.value}
            on:clear={() => ($orgUnitField.value = "")}
            errors={$orgUnitField.errors}
            bind:value={selectedOrgUnit}
            required={true}
          />
        {/await}
      {:else}
        <Search
          type="org-unit"
          title="{capital($_('specify'))} {$_('parent')}"
          bind:name={$orgUnitField.value}
          on:clear={() => ($orgUnitField.value = "")}
          errors={$orgUnitField.errors}
          bind:value={selectedOrgUnit}
          required={true}
        />
      {/if}
      <Breadcrumbs orgUnit={selectedOrgUnit} />
    </div>
  </div>
  <div class="flex py-6 gap-4">
    <Button
      type="submit"
      title={capital(
        $_("terminate_item", {
          values: { item: $_("unit", { values: { n: 1 } }) },
        })
      )}
    />
    <Button
      type="button"
      title={capital($_("cancel"))}
      outline={true}
      onClick={() => history.back()}
    />
    <Error />
  </div>
</form>
