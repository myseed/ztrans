<template>
  <d2-container class="page">
    <d2-page-cover
      title="欢迎使用上格快车物流系统"
      sub-title="上格快车">
    </d2-page-cover>
  </d2-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.page {
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 20px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
