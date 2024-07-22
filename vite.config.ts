import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteOssPlugin from 'vite-oss-plugin'
import ossConfig from './oss.config'

// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node
import { resolve } from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // treat all tags with a dash as custom elements
            isCustomElement: (tag) => tag === 'vue-advanced-chat' || tag === 'emoji-picker'
          }
        }
      }), 
      vueJsx(),
      viteOssPlugin(ossConfig)
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // 设置打包路径
    base: mode === 'prod' ? '/admin/prod/' : (mode === 'test' ? '/admin/test/' : '/'),
    server: {
      port: 3000, // 设置服务启动端口号
      open: true, // 设置服务启动时是否自动打开浏览器
      cors: true, // 允许跨域
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      // 通过环境变量来控制是否压缩
      terserOptions: {
        compress: {
          drop_console: mode === 'prod',
        },
      },
      minify: 'terser',
      // 构建入口文件
      entry: 'src/main.ts',
      // 构建出口目录
      outDir: 'dist',
      // 构建后是否压缩静态资源
      assetsInlineLimit: 4096,
      // 是否生成 source map
      sourcemap: false,
      // 是否为生产环境打开所有优化
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        }
      }
    }
  }
};
