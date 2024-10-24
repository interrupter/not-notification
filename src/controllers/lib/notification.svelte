<script>
  import { Elements } from 'not-bulma';
  const
    UILink = Elements.Links.UILink,
    UITitle = Elements.Various.UITitle,
    UIBlock = Elements.Blocks.UIBlock,
    UICommon = Elements.UICommon;

  /**
   * @typedef {Object} Props
   * @property {string} [title]
   * @property {string} [text]
   * @property {string} [link]
   * @property {number} [createdAt]
   */

  /** @type {Props} */
  let {
    title = '',
    text = '',
    link = '',
    createdAt = 0
  } = $props();
  
</script>

<div class="notification is-info">
  <UITitle size={2} {title} subtitle={UICommon.formatTimestamp(new Date(createdAt).getTime())}/>
  {#if link && link.length }
  <UIBlock><UILink url={link} light={true} outlined={true} color='info' icon='link' /></UIBlock>
  {/if}
  <UIBlock><pre>{text}</pre></UIBlock>
</div>
