import { env } from "$env/dynamic/public"
import { keycloak } from "$lib/util/keycloak"
import type { LoadEvent } from "@sveltejs/kit"

// TODO: Should not be disabled when possible
// Reason: https://stackoverflow.com/questions/71120958/fetch-error-when-refreshing-page-with-await-block-in-sveltekit
// Fixes being unable to refresh or open this route from a link
export const ssr = false

interface Query {
  data: Data | null
  errors?: Error[]
}

export interface Data {
  facets: Facet[]
  org_units: OrganisationUnitResponse[]
}

interface Facet {
  uuid: null | string
  user_key: string
  classes: Class[]
}

interface Class {
  name: string
  uuid: null | string
}

interface OrganisationUnitResponse {
  objects: OrganisationUnit[]
}

interface OrganisationUnit {
  uuid: null | string
  name: string
  parent: Class | null
}

interface Error {
  message: string
}

export const load = async (event: LoadEvent): Promise<Data> => {
  const query = `
      query {
        facets(user_keys: ["org_unit_level", "org_unit_type"]) {
          uuid
          user_key
          classes {
            name
            uuid
          }
        }
        org_units(uuids: "${event.params.uuid}") {
          objects {
            uuid
            name
            parent {
              uuid
              name
            }
          }
        }
      }
      `

  const token = keycloak ? keycloak.token : "Keycloak disabled"
  const res = await event.fetch(`${env.PUBLIC_BASE_URL}/graphql/v2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      query: query,
    }),
  })
  const json: Query = await res.json()
  if (json.data) {
    return json.data
  } else if (json.errors) {
    throw new Error(json.errors[0].message)
  } else {
    throw new Error("Unknown error during data fetching")
  }
}
