<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import DateInput from "$lib/components/forms/shared/DateInput.svelte"
  import Error from "$lib/components/alerts/Error.svelte"
  import Select from "$lib/components/forms/shared/Select.svelte"
  import Button from "$lib/components/shared/Button.svelte"
  import { enhance } from "$app/forms"
  import type { SubmitFunction } from "./$types"
  import { goto } from "$app/navigation"
  import { base } from "$app/paths"
  import { success, error } from "$lib/stores/alert"
  import { graphQLClient } from "$lib/util/http"
  import { KleAndFacetDocument, UpdateKleDocument } from "./query.generated"
  import { gql } from "graphql-request"
  import { page } from "$app/stores"
  import { date } from "$lib/stores/date"
  import { getClassesByFacetUserKey } from "$lib/util/getClasses"
  import SelectMultiple from "$lib/components/forms/shared/SelectMultiple.svelte"
  import { form, field } from "svelte-forms"
  import { required } from "svelte-forms/validators"
  import Skeleton from "$lib/components/forms/shared/Skeleton.svelte"
  import { getKleNumberTitleAndUuid, getMinMaxValidities } from "$lib/util/helpers"

  let toDate: string
  const fromDate = field("from", "", [required()])
  const kleNumber = field("kle_number", "", [required()])
  const kleAspects = field("kle_aspects", undefined, [required()])
  const svelteForm = form(fromDate, kleNumber, kleAspects)

  gql`
    query KLEAndFacet($uuid: [UUID!], $fromDate: DateTime, $toDate: DateTime) {
      facets(filter: { user_keys: ["kle_aspect", "kle_number"] }) {
        objects {
          validities {
            uuid
            user_key
            classes(filter: { from_date: null, to_date: null }) {
              name
              uuid
              user_key
            }
          }
        }
      }
      kles(filter: { uuids: $uuid, from_date: $fromDate, to_date: $toDate }) {
        objects {
          validities {
            uuid
            kle_aspects {
              name
              user_key
              uuid
            }
            kle_number(filter: { from_date: null, to_date: null }) {
              name
              user_key
              uuid
            }
            validity {
              from
              to
            }
            org_unit(filter: { from_date: null, to_date: null }) {
              validity {
                from
                to
              }
            }
          }
        }
      }
    }

    mutation UpdateKLE($input: KLEUpdateInput!, $date: DateTime!) {
      kle_update(input: $input) {
        current(at: $date) {
          org_unit(filter: { from_date: null, to_date: null }) {
            name
          }
        }
      }
    }
  `

  const handler: SubmitFunction =
    () =>
    async ({ result }) => {
      await svelteForm.validate()
      if ($svelteForm.valid) {
        if (result.type === "success" && result.data) {
          try {
            const mutation = await graphQLClient().request(UpdateKleDocument, {
              input: result.data,
              date: result.data.validity.from,
            })
            $success = {
              message: capital(
                $_("success_edit_item", {
                  values: {
                    item: $_("kle", { values: { n: 0 } }),
                    name: mutation.kle_update.current?.org_unit?.[0]?.name,
                  },
                })
              ),
              uuid: $page.params.uuid,
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
    $_("edit_item", {
      values: { item: $_("kle", { values: { n: 1 } }) },
    })
  )} | OS2mo</title
>

<div class="flex align-center px-6 pt-6 pb-4">
  <h3 class="flex-1">
    {capital(
      $_("edit_item", {
        values: { item: $_("kle", { values: { n: 1 } }) },
      })
    )}
  </h3>
</div>

<div class="divider p-0 m-0 mb-4 w-full" />

{#await graphQLClient().request( KleAndFacetDocument, { uuid: $page.params.kle, fromDate: $page.url.searchParams.get("from"), toDate: $page.url.searchParams.get("to") } )}
  <div class="mx-6">
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
      </div>
    </div>
  </div>
{:then data}
  {@const kle = data.kles.objects[0].validities[0]}
  {@const facets = data.facets.objects}
  {@const kleNumbers = getClassesByFacetUserKey(facets, "kle_number")}
  {@const validities = getMinMaxValidities(data.kles.objects[0].validities[0].org_unit)}

  <form method="post" class="mx-6" use:enhance={handler}>
    <div class="sm:w-full md:w-3/4 xl:w-1/2 bg-slate-100 rounded">
      <div class="p-8">
        <div class="flex flex-row gap-6">
          <DateInput
            startValue={$date}
            bind:value={$fromDate.value}
            errors={$fromDate.errors}
            title={capital($_("date.start_date"))}
            id="from"
            min={validities.from}
            max={toDate ? toDate : validities.to}
            required={true}
          />
          <DateInput
            bind:value={toDate}
            startValue={kle.validity.to ? kle.validity.to.split("T")[0] : null}
            title={capital($_("date.end_date"))}
            id="to"
            min={$fromDate.value}
            max={validities.to}
          />
        </div>
        <Select
          title={capital($_("kle_number"))}
          id="kle-number"
          startValue={kle.kle_number[0]}
          bind:name={$kleNumber.value}
          errors={$kleNumber.errors}
          iterable={getKleNumberTitleAndUuid(kleNumbers ? kleNumbers : [])}
          required={true}
        />
        <SelectMultiple
          bind:name={$kleAspects.value}
          errors={$kleAspects.errors}
          title={capital($_("kle_aspect"))}
          id="kle-aspects"
          startValue={kle.kle_aspects}
          iterable={getClassesByFacetUserKey(facets, "kle_aspect")}
          required={true}
        />
      </div>
    </div>
    <div class="flex py-6 gap-4">
      <Button
        type="submit"
        title={capital(
          $_("edit_item", {
            values: { item: $_("kle", { values: { n: 1 } }) },
          })
        )}
      />
      <Button
        type="button"
        title={capital($_("cancel"))}
        outline={true}
        href="{base}/organisation/{$page.params.uuid}"
      />
    </div>
    <Error />
  </form>
{/await}
