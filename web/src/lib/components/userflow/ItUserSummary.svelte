<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import { ituserInfo } from "$lib/stores/ituserInfoStore"
</script>

<div>
  <h3 class="pb-2 text-primary">{capital($_("ituser", { values: { n: 1 } }))}</h3>
  <dl class="grid gap-1">
    <div class="grid grid-cols-2">
      <dt>{capital($_("date.start_date"))}:</dt>
      {#if $ituserInfo.validated === true}
        <dd>{$ituserInfo.fromDate}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("date.end_date"))}:</dt>
      {#if $ituserInfo.validated === true}
        <dd>{$ituserInfo.toDate}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("itsystem"))}:</dt>
      {#if $ituserInfo.validated === true}
        <dd>{$ituserInfo.itSystem.name}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("account_name"))}:</dt>
      {#if $ituserInfo.validated === true}
        <dd>{$ituserInfo.userkey}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("primary"))}:</dt>
      {#if $ituserInfo.validated === true}
        <dd>{$ituserInfo.primary ? $ituserInfo.primary.name : ""}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("notes"))}:</dt>
      {#if $ituserInfo.validated === true}
        <dd>{$ituserInfo.notes ? $ituserInfo.notes : ""}</dd>
      {/if}
    </div>
  </dl>
</div>
