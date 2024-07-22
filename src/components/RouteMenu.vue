<template>
    <!-- 如果存在子路由 -->
    <template v-if="route.children">
        <a-sub-menu :key="route.name" :title="route.meta?.title || '未命名'" :expandIcon="route.open">
            <template #icon>
                <component v-if="route.meta?.icon" :is="route.meta.icon" />
                <IconFont v-if="route.meta?.iconfont" :type="route.meta.iconfont" />
            </template>
            <template v-for="children of route.children">
                <!-- 递归 -->
                <RouteMenu :route="children" />
            </template>
        </a-sub-menu>
    </template>
    <template v-else-if="!route.meta?.hideInMenu">
        <a-menu-item :key="route.name" @click="go(route)">
            <component v-if="route.meta?.icon" :is="route.meta.icon" />
            <IconFont v-if="route.meta?.iconfont" :type="route.meta.iconfont" />
            <span class="nav-text"> {{ route.meta?.title || "未命名" }} </span>
        </a-menu-item>
    </template>
</template>

<script setup>
    import router from '../router/index';
    import { createFromIconfontCN } from '@ant-design/icons-vue';
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_4531317_6vgdkt3x42p.js',
    });
    defineProps({
        route: Object
    })
    const go = function(route) {
        router.push(route.path);
    };
</script>
<style scope lang="less"></style>

