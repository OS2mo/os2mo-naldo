<script lang="ts">
  import { _ } from "svelte-i18n"
  import { base } from "$app/paths"
  import { page } from "$app/stores"
  import Icon from "@iconify/svelte"
  import addCircleOutlineRounded from "@iconify/icons-material-symbols/add-circle-outline-rounded"
  import editSquareOutlineRounded from "@iconify/icons-material-symbols/edit-square-outline-rounded"
  import swapHorizRounded from "@iconify/icons-material-symbols/swap-horiz-rounded"
  import cancelOutlineRounded from "@iconify/icons-material-symbols/cancel-outline-rounded"

  enum Form {
    CREATE = "create",
    RENAME = "rename",
    MOVE = "move",
    TERMINATE = "terminate",
  }
</script>

<div class="navbar bg-primary min-h-0 text-base-100">
  <div class="flex-1">
    <a
      href={`${base}/organisation/${$page.params.uuid ? `${$page.params.uuid}/` : ""}${
        Form.CREATE
      }/unit`}
      class="btn btn-sm btn-primary text-base-100 hover:no-underline normal-case font-normal align-middle"
    >
      <Icon icon={addCircleOutlineRounded} width="20" height="20" />
      <p class="text-base-100">{$_("navigation.create_unit")}</p>
    </a>
    <a
      href={`${base}/organisation/${$page.params.uuid ? `${$page.params.uuid}/` : ""}${
        Form.RENAME
      }/unit`}
      class="btn btn-sm btn-primary text-base-100 hover:no-underline normal-case font-normal"
    >
      <Icon icon={editSquareOutlineRounded} width="20" height="20" />
      <p class="text-base-100">{$_("navigation.rename_unit")}</p>
    </a>
    <a
      href={`${base}/organisation/${$page.params.uuid ? `${$page.params.uuid}/` : ""}${
        Form.MOVE
      }/unit`}
      class="btn btn-sm btn-primary text-base-100 hover:no-underline normal-case font-normal"
    >
      <Icon icon={swapHorizRounded} width="20" height="20" />
      <p class="text-base-100">{$_("navigation.move_unit")}</p>
    </a>
    <a
      href={`${base}/organisation/${$page.params.uuid ? `${$page.params.uuid}/` : ""}${
        Form.MOVE
      }/engagements`}
      class="btn btn-sm btn-primary text-base-100 hover:no-underline normal-case font-normal"
    >
      <Icon icon={swapHorizRounded} width="20" height="20" />
      <p class="text-base-100">{$_("navigation.move_engagements")}</p>
    </a>
    <a
      href={`${base}/organisation/${$page.params.uuid ? `${$page.params.uuid}/` : ""}${
        Form.TERMINATE
      }/unit`}
      class="btn btn-sm btn-primary text-base-100 hover:no-underline normal-case font-normal"
    >
      <Icon icon={cancelOutlineRounded} width="20" height="20" />
      <p class="text-base-100">{$_("navigation.terminate_unit")}</p>
    </a>
  </div>
</div>
