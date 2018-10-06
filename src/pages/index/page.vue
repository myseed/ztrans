<template>
  <d2-container class="page">
    <d2-page-cover
      title="欢迎使用中福通物流系统"
      sub-title="中福通物流">
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
