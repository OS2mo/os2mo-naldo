<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import DateInput from "$lib/components/forms/shared/DateInput.svelte"
  import Error from "$lib/components/alerts/Error.svelte"
  import Select from "$lib/components/forms/shared/Select.svelte"
  import { enhance } from "$app/forms"
  import { goto } from "$app/navigation"
  import { base } from "$app/paths"
  import { success, error } from "$lib/stores/alert"
  import { graphQLClient } from "$lib/util/http"
  import { gql } from "graphql-request"
  import { page } from "$app/stores"
  import { date } from "$lib/stores/date"
  import type { SubmitFunction } from "./$types"
  import {
    CreateRoleBindingDocument,
    ItUserAndFacetDocument,
    GetItSystemRolesDocument,
  } from "./query.generated"
  import { form, field } from "svelte-forms"
  import { required } from "svelte-forms/validators"
  import Skeleton from "$lib/components/forms/shared/Skeleton.svelte"
  import {
    getITUserITSystemName,
    getMinMaxValidities,
    type UnpackedClass,
  } from "$lib/util/helpers"
  import { getClassesByFacetUserKey } from "$lib/util/get_classes"

  let toDate: string

  let itUser: {
    uuid: string
    name: string
    itsystem: {
      uuid: string
    }
  }
  let itSystemRoles: UnpackedClass | undefined

  const fromDate = field("from", "", [required()])
  const roleField = field("role", "", [required()])
  const svelteForm = form(fromDate, roleField)

  gql`
    query ITUserAndFacet($uuid: [UUID!]) {
      employees(filter: { uuids: $uuid, from_date: null, to_date: null }) {
        objects {
          current {
            itusers {
              itsystem {
                name
                user_key
                uuid
              }
              uuid
              user_key
              validity {
                from
                to
              }
            }
          }
          validities {
            validity {
              from
              to
            }
          }
        }
      }
    }

    query GetITSystemRoles($itSystemUuid: [UUID!]) {
      classes(
        filter: { facet: { user_keys: "role" }, it_system: { uuids: $itSystemUuid } }
      ) {
        objects {
          objects {
            uuid
            user_key
            name
          }
        }
      }
    }

    mutation CreateRoleBinding($input: RoleBindingCreateInput!, $date: DateTime!) {
      rolebinding_create(input: $input) {
        current(at: $date) {
          ituser {
            person {
              name
            }
          }
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
            const mutation = await graphQLClient().request(CreateRoleBindingDocument, {
              input: result.data,
              date: result.data.validity.from,
            })
            $success = {
              message: capital(
                $_("success_create_item", {
                  values: {
                    item: $_("rolebinding", { values: { n: 0 } }),
                    name: mutation.rolebinding_create.current?.ituser?.[0].person?.[0]
                      .name,
                  },
                })
              ),
              uuid: $page.params.uuid,
              type: "employee",
            }
          } catch (err) {
            $error = { message: err }
          }
        }
      }
    }

  const fetchItSystemRoles = async (itSystemUuid: string | undefined | null) => {
    const res = await graphQLClient().request(GetItSystemRolesDocument, {
      itSystemUuid: itSystemUuid,
    })
    itSystemRoles = res.classes?.objects
      .map((cls) => cls.objects[0])
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  }
</script>

<title
  >{capital(
    $_("create_item", {
      values: { item: $_("rolebinding", { values: { n: 1 } }) },
    })
  )} | OS2mo</title
>

<div class="flex align-center px-6 pt-6 pb-4">
  <h3 class="flex-1">
    {capital(
      $_("create_item", {
        values: { item: $_("rolebinding", { values: { n: 1 } }) },
      })
    )}
  </h3>
</div>

<div class="divider p-0 m-0 mb-4 w-full" />

{#await graphQLClient().request(ItUserAndFacetDocument, { uuid: $page.params.uuid })}
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
  {@const validities = getMinMaxValidities(data.employees.objects[0].current?.itusers)}
  {@const itUsers = getITUserITSystemName(data.employees.objects[0].current?.itusers)}

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
            title={capital($_("date.end_date"))}
            id="to"
            min={$fromDate.value ? $fromDate.value : validities.from}
            max={validities.to}
          />
        </div>
        <div class="flex flex-row gap-6">
          <Select
            title={capital($_("ituser", { values: { n: 1 } }))}
            id="it-user-uuid"
            bind:value={itUser}
            iterable={itUsers}
            on:change={() => {
              fetchItSystemRoles(itUser.itsystem.uuid)
            }}
            required={true}
            extra_classes="basis-1/2"
          />
          {#if itSystemRoles && itSystemRoles.length}
            <Select
              title={capital($_("role", { values: { n: 1 } }))}
              id="role-uuid"
              bind:name={$roleField.value}
              errors={$roleField.errors}
              iterable={itSystemRoles}
              extra_classes="basis-1/2"
              required
            />
          {:else}
            <Select
              title={capital($_("role", { values: { n: 1 } }))}
              id="role-uuid"
              bind:name={$roleField.value}
              errors={$roleField.errors}
              extra_classes="basis-1/2"
              required
              disabled
            />
          {/if}
        </div>
      </div>
    </div>
    <div class="flex py-6 gap-4">
      <button
        type="submit"
        class="btn btn-sm btn-primary rounded normal-case font-normal text-base text-base-100"
        >{capital(
          $_("create_item", {
            values: { item: $_("rolebinding", { values: { n: 1 } }) },
          })
        )}</button
      >
      <button
        type="button"
        class="btn btn-sm btn-outline btn-primary rounded normal-case font-normal text-base"
        on:click={() => goto(`${base}/employee/${$page.params.uuid}`)}
      >
        {capital($_("cancel"))}
      </button>
    </div>
    <Error />
  </form>
{/await}
