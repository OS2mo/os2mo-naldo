import { _ } from "svelte-i18n"
import { capital } from "$lib/util/translationUtils"
import { get } from "svelte/store"
import { resolveFieldValue, type SelectedQuery, type Field } from "$lib/util/helpers"

// Function to convert JSON data to CSV format
export const json2csv = (data: any[], selectedQueries: SelectedQuery[]): string => {
  let csvHeader: string[] = []
  let csvRows: string[] = []
  let columnOffsets: number[] = [] // Keeps track of column start positions for each query

  // Check if `org_units` is the only subject
  const hasOtherQueries = selectedQueries.some(
    (query) => query.mainQuery?.operation !== "org_units"
  )

  // Create org_unit data if present. This is needed since we want the data to be in every row
  // and on top of that, we want it to be at the start of every row.
  let orgUnitData: string[] = []
  const orgUnitsQuery = selectedQueries.find(
    (query) => query.mainQuery?.operation === "org_units"
  )
  if (orgUnitsQuery) {
    const { chosenFields } = orgUnitsQuery
    const unitData = data[0]

    // Calculate headers and offsets for org_units data
    const orgUnitHeader = chosenFields.flatMap((header) => {
      const headerText = capital(get(_)(header.value, { values: { n: 1 } }))
      if (header.value === "validity") {
        return [`${capital(get(_)("from"))}`, `${capital(get(_)("to"))}`]
      }
      return headerText
    })

    // Set column offset for org_units
    const orgUnitsOffset = csvHeader.length
    columnOffsets[selectedQueries.indexOf(orgUnitsQuery)] = orgUnitsOffset
    csvHeader = csvHeader.concat(orgUnitHeader)

    // Populate orgUnitData with values
    orgUnitData = new Array(csvHeader.length).fill("")
    let currentOffset = orgUnitsOffset
    chosenFields.forEach((field: Field, index) => {
      let values: string[] = []
      const fieldValue = resolveFieldValue(unitData, field)

      if (field.value === "validity") {
        // Handle validity field
        values = [unitData.validity?.from || "", unitData.validity?.to || ""]
      } else {
        // Handle general case
        values = fieldValue ? [JSON.stringify(fieldValue)] : [""]
      }

      // Insert values into the orgUnitData array
      values.forEach((value) => {
        orgUnitData[currentOffset] = value
        currentOffset++
      })
    })

    // If only `org_units` is present in the query, push it to the row.
    // This is done, since if we have other queries, we want the orgUnitData to on every row, and not by itself.
    if (!hasOtherQueries) {
      csvRows.push(orgUnitData.join(","))
    }
  }

  // Process the rest of the queries and calculate headers
  selectedQueries.forEach((selectedQuery, index) => {
    const { chosenFields, mainQuery } = selectedQuery
    if (mainQuery?.operation !== "org_units") {
      const currentHeader = chosenFields.flatMap((header) => {
        const headerText = capital(get(_)(header.value, { values: { n: 1 } }))
        if (header.value === "related_unit") {
          return [`${headerText} 1`, `${headerText} 2`]
        } else if (header.value === "validity") {
          return [`${capital(get(_)("from"))}`, `${capital(get(_)("to"))}`]
        }
        return headerText
      })

      // Set column offset for this query
      columnOffsets[index] = csvHeader.length
      csvHeader = csvHeader.concat(currentHeader)
    }
  })

  // Prepare rows for other queries
  selectedQueries.forEach((selectedQuery, queryIndex) => {
    const { chosenFields, mainQuery } = selectedQuery
    const startOffset = columnOffsets[queryIndex]

    if (mainQuery && mainQuery.operation !== "org_units") {
      // TODO: Make 'subject' first in row (after org_unit)
      const itemsArray = data[0][mainQuery.operation]
      itemsArray.forEach((item: any) => {
        const row: string[] = [...orgUnitData] // Start each row with orgUnitData

        let currentOffset = startOffset
        chosenFields.forEach((header) => {
          const fieldValue = resolveFieldValue(item, header)
          let values: string[] = []

          if (header.value === "related_unit") {
            // Handle related units
            values = [item.org_units[0]?.name || "", item.org_units[1]?.name || ""]
          } else if (header.value === "validity") {
            // Handle validity field
            const fromValue = item.validity?.from || ""
            const toValue = item.validity?.to || ""
            values = [fromValue, toValue]
          } else {
            // Handle general case
            values = fieldValue ? [JSON.stringify(fieldValue)] : [""]
          }

          // Insert values into the row array at the correct positions
          values.forEach((value) => {
            row[currentOffset] = value
            currentOffset++
          })
        })

        csvRows.push(row.join(","))
      })
    }
  })

  // Combine header and rows
  const csvData = [csvHeader.join(","), ...csvRows].join("\n")

  return csvData
}

// Function to handle the download action
export const downloadHandler = (
  event: MouseEvent,
  data: any[],
  selectedQueries: SelectedQuery[],
  filename: string
) => {
  event.preventDefault()

  // Generate CSV and trigger download
  const csvData: string = json2csv(data, selectedQueries)
  const blob: Blob = new Blob([csvData], { type: "text/csv" })
  const link: HTMLAnchorElement = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename ? `${filename}.csv` : "insights.csv"
  link.click()
}
