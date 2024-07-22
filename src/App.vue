<template>
<div>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</div>
</template>
<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
dayjs.locale(zhCN)


</script>
<style lang='less' scoped>

</style>