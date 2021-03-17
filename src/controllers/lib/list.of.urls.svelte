<script>
  import {UICommon} from 'not-bulma';
  import {
    createEventDispatcher
  } from 'svelte';
  let dispatch = createEventDispatcher();

  export let inputStarted = false;
  export let value        = '';
  export let placeholder   = 'List of urls';
  export let fieldname     = 'list-of-urls';
  export let rows = 10;
  export let required = true;
  export let readonly = false;
  export let valid = true;
  export let validated = false;
  export let errors = false;
  export let formErrors = false;
  export let formLevelError = false;

  $: allErrors = [].concat(errors?errors:[], formErrors?formErrors:[]);
  $: helper = allErrors?allErrors.join(', '): placeholder;
  $: invalid = ((valid===false) || (formLevelError));
  $: validationClasses = (valid===true || !inputStarted)?UICommon.CLASS_OK:UICommon.CLASS_ERR;

  function onBlur(ev){
    let data = {
      field: fieldname,
      value: ev.currentTarget.value
    };
    inputStarted = true;
    dispatch('change', data);
    return true;
  }

  function onInput(ev){
    let data = {
      field: fieldname,
      value: ev.currentTarget.value
    };
    inputStarted = true;
    dispatch('change', data);
    return true;
  }
</script>

<div class="control">
  <textarea
    id="form-field-listOfUrls-{fieldname}"
    name={fieldname}
    bind:value={value}
    class="textarea {validationClasses}"
    {readonly}
    disabled={readonly}
    invalid="{invalid}"
    required={required}
    on:change={onBlur} on:input={onInput}
    {rows}
    placeholder="{placeholder}"
    aria-controls="input-field-helper-{fieldname}" aria-describedby="input-field-helper-{fieldname}"
    ></textarea>
    {#if validated === true }
    <span class="icon is-small is-right">
      {#if valid === true }
      <i class="fas fa-check"></i>
      {:else if (valid === false) }
      <i class="fas fa-exclamation-triangle"></i>
      {/if}
    </span>
    {/if}
</div>
<p class="help {validationClasses}" id="input-field-helper-{fieldname}">
  {#if !(validated && valid) && (inputStarted) }
  {helper}
  {:else}&nbsp;{/if}
</p>
