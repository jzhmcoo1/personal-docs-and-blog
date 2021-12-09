# Vue3 Todo List Demo

## 搭建项目

使用`Vue3.x+TS+Vite2.x+AntDesignVue3.x`进行搭建

### 使用 Vite 创建项目

```bash
yarn create vite vue3-todolist-demo --template vue-ts
```

创建完成后，进去目录，使用`yarn`下载依赖

使用`yarn dev`即可进入开发模式

### 安装插件以解析 JSX(TSX)

下载开发依赖：

```bash
yarn add -D @vitejs/plugin-vue-jsx
```

修改以下文件

```ts title="vite.config.ts" {7}
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
});
```

### 配置路径别名

> 参考文档：[vite vue-ts 配置 “@” 路径别名](https://juejin.cn/post/7006213924588617735)

第一步：配置 vite

修改以下文件，加入`resolve.alias`配置

```ts title="vite.config.ts" {9-13}
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
```

第二步：配置 TS

1. 新建`tsconfig.extend.json`文件

```json title="tsconfig.extend.json"
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

2. 把该文件加入`tsconfig`的 extends 属性

```ts title="tsconfig.json" {2}
{
  "extends": "./tsconfig.extend.json",
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

第三步：测试效果

修改 App.vue 文件，修改 HelloWorld 组件的引入路径为带有@符号的

```jsx {4}
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

### 配置开发依赖

安装 prettier + commitlint + husky + lint-staged

```bash
yarn add -D husky lint-staged prettier @commitlint/{config-conventional,cli}
```

编写对应的配置文件

```js title="commitlint.config.js"
module.exports = { extends: ["@commitlint/config-conventional"] };
```

```json title=".prettierrc.json"
{
  "tabWidth": 2,
  "jsxSingleQuote": true,
  "semi": true,
  "singleQuote": true
}
```

```txt title=".pretterignore"
# Ignore artifacts:
build
coverage
dist
```

执行脚本

```bash
npx husky install
npm set-script prepare "husky install"
# Add Hook
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

在 package.json 文件中添加如下配置：

```json title="package.json"
"lint-staged": {
	"**/*": "prettier --write --ignore-unknown"
}
```

尝试提交：

```txt title="git commit message"
build: 搭建开发环境
```

提交成功，至此基本开发环境搭建完成

## 安装 Ant Design Vue Next

```bash
yarn add ant-design-vue@next
```

参考文档：[Ant Design of Vue](https://next.antdv.com/docs/vue/introduce-cn)

### 做一步 Vite 按需引入

参考文档：[~~按需引入~~](https://next.antdv.com/docs/vue/introduce-cn#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)

~~安装：`vite-plugin-components`~~

:::caution

`vite-plugin-components`已经改名为`unplugin-vue-components`

文档：[antfu | unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)

:::

```bash
yarn add -D unplugin-vue-components
```

修改如下文件

```ts title="vite.config.ts" {5,6,13-16}
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [AntDesignVueResolver()],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
```

然后试了很久，发现这个 vite 插件好像还不支持 jsx，[看这个 issue](https://github.com/antfu/unplugin-vue-components/issues/208)

很可惜，那之后就用 template 来写，好处就是可以直接使用组件，无需引入

## 添加 Vue3 的 vscode 插件

官方推荐安装的 Volar，但是好像现有的 Code Snippet 还不太足够，就自己设置了一个 vue 的 snippet：

```json
{
  "vue3": {
    "prefix": "vue3ts",
    "body": [
      "<template>",
      "  $2",
      "</template>",
      "",
      "<script lang=\"ts\">",
      "import { defineComponent } from 'vue'",
      "",
      "export default defineComponent({",
      "  name: '$1',",
      "  setup() {",
      "    $0",
      "  },",
      "})",
      "</script>\n"
    ]
  }
}
```

打出来是这个样子的：

```jsx
<template>

</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '',
  setup() {

  },
})
</script>

```

## 编写项目结构

:::note

[TodoMVC](https://todomvc.com/)，这个网站有各种技术栈编写的 todolist demo，推荐参考

:::

项目结构如下所示：

```txt
src
├── App.vue
├── assets
│   └── logo.png
├── components
│   ├── todo-footer
│   │   └── index.vue
│   ├── todo-header
│   │   └── index.vue
│   └── todolist
│       └── index.vue
├── context
│   ├── index.ts
│   └── useTodo.ts
├── env.d.ts
├── main.ts
└── typings
    └── TodoItem.ts
```

### main.ts

首先来看一下入口文件

```ts title="src/main.ts"
import { createApp } from "vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.css";

const app = createApp(App);

app.mount("#app");
```

引入 css 是因为，好像这个 vite 插件在使用 message 组件提示框的时候，样式还是失效了，所以还是作了引入

### App.vue

```jsx title="src/App.vue"
<template>
  <a-layout>
    <Header />
    <todo-list class="layout" />
    <Footer />
  </a-layout>
</template>

<script lang="ts" setup>
import Header from '@/components/todo-header/index.vue';
import todoList from '@/components/todolist/index.vue';
import Footer from '@/components/todo-footer/index.vue';
import useProvide from './context';

useProvide(); // 使用全局Provide
</script>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style>
.layout {
  min-height: calc(100vh - 4rem - 4.375rem);
}
</style>
```

项目中编写了自定义 hook，提供了一个全局 Provider，类似于 React Hook 里的 useContext。

另外进行了上中下三个部分的组件拆分，使用了 Ant Design Vue 的 Layout

### context

这个文件作为全局 Provider 的入口文件，以后项目中只要有用到新的 Provider，都可以在这里进行引入

```ts title="src/context/index.ts"
import { useTodoProvide, useTodoInject } from "./useTodo";

export { useTodoInject };

export default function useProvide() {
  useTodoProvide();
}
```

```ts title="src/context/useTodo.ts"
import {
  computed,
  ComputedRef,
  inject,
  provide,
  reactive,
  Ref,
  ref,
  toRefs,
  toRef,
  WritableComputedRef,
} from "vue";
import TodoItem, { showType } from "@/typings/TodoItem";
import dayjs from "dayjs";

const initTodoList: () => TodoItem[] = () => {
  return [
    { id: "001", content: "吃饭", done: false, date: dayjs(), hover: false },
    { id: "002", content: "睡觉", done: false, date: dayjs(), hover: false },
    { id: "003", content: "打代码", done: false, date: dayjs(), hover: false },
  ];
};

interface TodoProvider {
  todoList: ComputedRef<Ref<TodoItem[]>>;
  addTodoItem: (todoItem: TodoItem) => void;
  deleteItemById: (id: string) => void;
  allDone: WritableComputedRef<boolean>;
  deleteDone: () => void;
  handleShowState: (msg: showType) => void;
  currentLength: ComputedRef<number>;
  realLength: ComputedRef<number>;
}

const TodoSymbol = Symbol("todo symbol");

export function useTodoProvide() {
  const todoState = reactive({
    todoList: initTodoList(),
    showState: showType.all,
  });

  const addTodoItem = (todoItem: TodoItem) => {
    todoState.todoList.unshift(todoItem);
  };

  const deleteItemById = (id: string) => {
    const index = todoState.todoList.findIndex((item) => item.id === id);
    if (index !== -1) {
      todoState.todoList.splice(index, 1);
    }
  };

  const checkedAll = () => {
    todoState.todoList.forEach((item) => {
      item.done = true;
    });
  };

  const cancelAll = () => {
    todoState.todoList.forEach((item) => {
      item.done = false;
    });
  };

  const computedTodoList = computed(() => {
    if (todoState.showState === showType.all) {
      return todoState.todoList;
    } else if (todoState.showState === showType.done) {
      return todoState.todoList.filter((item) => item.done === true);
    } else {
      return todoState.todoList.filter((item) => item.done === false);
    }
  });

  const realLength = computed(() => todoState.todoList.length);
  const currentLength = computed(() => computedTodoList.value.length);

  const handleShowState = (msg: showType) => {
    todoState.showState = msg;
  };

  const allDone = computed<boolean>({
    get() {
      return (
        todoState.todoList.length !== 0 &&
        todoState.todoList.every((item) => item.done === true)
      );
    },
    set(newValue) {
      if (newValue) {
        checkedAll();
      } else {
        cancelAll();
      }
    },
  });

  const deleteDone = () => {
    todoState.todoList = todoState.todoList.filter((item) => !item.done);
  };

  provide(TodoSymbol, {
    todoList: computedTodoList,
    addTodoItem,
    deleteItemById,
    allDone,
    deleteDone,
    handleShowState,
    realLength,
    currentLength,
  });
}

export function useTodoInject() {
  const todoContext = inject<TodoProvider>(TodoSymbol);
  if (!todoContext) {
    throw new Error("useTodoInject must be used after useTodoProvider");
  }
  return todoContext;
}
```

在这个文件中，我们定义了 todolist 的一系列响应式状态，和操作/获取它们的 api 方法，通过 provide 使其全局可用。只要需要数据的地方，使用`useTodoInject()`便可获取数据。

其中，由于需要切换 todolist 的展示条件，todoList 返回的是一个 computedRef，真实的数据在 useTodoProvide 中，并没有进行暴露。

### components

组件的代码比较长，可以见 Github 仓库源码，总体来说写好全局 Provider 后，获取数据变得非常容易，所以编写起来也不麻烦

## 项目地址

- 仓库地址：[jzhmcoo1](https://github.com/jzhmcoo1)/**[vue3-todolist-demo](https://github.com/jzhmcoo1/vue3-todolist-demo)**
- demo 地址：[Vercel](http://vue3-todolist-demo.vercel.app/)
