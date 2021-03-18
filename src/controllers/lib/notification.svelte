<script>
  import {UITitle, UIBlock, UICommon } from 'not-bulma';
  export let title ='';
  export let text ='';
  export let createdAt = 0;
</script>

<div class="notification is-info">
  <UITitle size={2} {title} subtitle={UICommon.formatTimestamp(new Date(createdAt).getTime())}/>
  <UIBlock>{text}</UIBlock>
</div>
