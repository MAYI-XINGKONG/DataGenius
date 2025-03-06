<template>
    <div class="App">
        <div class="logo-box">
            <img src="../assets/logo-vite.png" class="logo vite" alt="Electron + Vite logo" />
            <img src="../assets/logo-electron.svg" class="logo electron" alt="Electron + Vite logo" />
        </div>
        <div class="card">
            <a-form :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 14}" autocomplete="off">
                <a-form-item label="Username" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>

                <a-form-item label="Password" name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
            </a-form>
            <button @click="onFinish">
                登录
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

interface FormState {
    username: string;
    password: string;
    remember: boolean;
}

const formState = reactive<FormState>({
    username: 'admin',
    password: '123456',
} as FormState);

const router = useRouter();

const onFinish = async () => {
    let result = await (window as any).myAPI.login(formState.username, formState.password)
    if (result.code === 200) {
        message.success(result.msg, 1);
        // 登录成功后跳转到主界面
        router.push('/main_view/index');
    } else {
        message.error(result.msg, 2);
    }

};
</script>

<style lang="scss" scoped>
.logo-box {
    position: relative;
    height: 12em;
}

.logo {
    position: absolute;
    left: calc(50% - 4.5em);
    height: 10em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

@keyframes logo-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: no-preference) {
    .logo.electron {
        animation: logo-spin infinite 20s linear;
    }
}

.card {
    padding: 2em;

    .ant-form {
        width: 700px;
        margin: 0 auto;
    }

}


.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}
strong{
    color: #5c61ff;
    font-size: 16px;
}
</style>
