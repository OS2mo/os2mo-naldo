<script lang="ts">
  import { _ } from "svelte-i18n"
  import { capital } from "$lib/util/translationUtils"
  import { addressInfo } from "$lib/stores/addressInfoStore"
</script>

<div>
  <h3 class="pb-2 text-primary">{capital($_("address", { values: { n: 1 } }))}</h3>
  <dl class="grid gap-1">
    <div class="grid grid-cols-2">
      <dt>{capital($_("date.start_date"))}:</dt>
      {#if $addressInfo.validated === true}
        <dd>{$addressInfo.fromDate}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("date.end_date"))}:</dt>
      {#if $addressInfo.validated === true}
        <dd>{$addressInfo.toDate}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("visibility"))}:</dt>
      {#if $addressInfo.validated === true}
        <dd>{$addressInfo.visibility?.name ? $addressInfo.visibility.name : ""}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("description"))}:</dt>
      {#if $addressInfo.validated === true}
        <dd>{$addressInfo.userkey ? $addressInfo.userkey : ""}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      <dt>{capital($_("address_type"))}:</dt>
      {#if $addressInfo.validated === true}
        <dd>{$addressInfo.addressType.name ? $addressInfo.addressType.name : ""}</dd>
      {/if}
    </div>
    <div class="grid grid-cols-2">
      {#if $addressInfo.validated === true}
        <dt>{capital($_($addressInfo.addressType.name))}:</dt>
        {#if typeof $addressInfo.addressValue === "object"}
          <dd>{$addressInfo.addressValue.name}</dd>
        {:else}
          <dd>{$addressInfo.addressValue}</dd>
        {/if}
      {/if}
    </div>
  </dl>
</div>
