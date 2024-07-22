import { createApp } from "vue";
import App from "./App.vue";
import "./common/base.css";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// import 'antd/dist/antd.css';
import "ant-design-vue/dist/antd.css";

import "./assets/css/index.css";

import router from "./router/index";
import state from "./state/index";

import VueQrcode from '@chenfengyuan/vue-qrcode';

import { registerIconsComp } from './icons';

import Storage from 'vue-lsp';

const app = createApp(App)
// 注册二维码组件
app.component(VueQrcode.name, VueQrcode);
// 按需注册ICON组件
registerIconsComp(app);

app.use(Storage, {
    namespace: 'flow__', // key prefix
    name: 'ls', // name variable [ls] or [$ls],
    storage: 'local', // storage name session, local, memory
});

app.use(Antd).use(router).use(state).mount("#app");