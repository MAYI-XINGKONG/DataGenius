<template>
    <div class="settings-view">
        <h2>设置</h2>
        <button @click="goHome">主界面</button>
        <!-- 这里可以添加设置项 -->
    </div>
</template>

<script lang="ts" setup>
    import {useRouter} from "vue-router";
    const router = useRouter();

    const goHome = () => {
        // 回到到主界面
        router.push('/main_view/index');
    }
</script>

<style scoped>
    .settings-view {
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
</style>
