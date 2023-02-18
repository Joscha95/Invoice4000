<template>
  <div class="button_wrapper">
    <slot>

    </slot>
  </div>
</template>

<script>
export default {

}
</script>

<style>

  .button_wrapper{
    position: absolute;
    right:var(--site-padding);
    top:var(--site-padding);
    display: flex;
  }

  .button_wrapper > *{
    margin-right:var(--site-padding);
    display: inline-block;
  }

  .button_wrapper > *:last-child{
    margin-right:0;
  }
</style>