<template>
    <div class="main-view">
        <div class="menu-bar">
            <button @click="openSettings">设置</button>
        </div>
        <div class="main-panel">
            <div class="left-panel">
                <DataSource />
            </div>
            <div class="bottom-console">
                <ControlConsole />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';
    import DataSource from './panel/DataSource.vue';
    import ControlConsole from './panel/ControlConsole.vue';

    const router = useRouter();

    const openSettings = () => {
        router.push('/settings_view/index');
    };
</script>

<style scoped>
    .main-view {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .menu-bar {
        padding: 10px;
        background-color: #f0f0f0;
    }

    .main-panel {
        display: flex;
        flex: 1;
    }

    .left-panel {
        flex: 1;
        border-right: 1px solid #ccc;
        background-color: lightblue;
    }

    .bottom-console {
        height: 200px;
        border-top: 1px solid #ccc;
        overflow-y: auto;
        background-color: #cccccc;
    }
</style>
