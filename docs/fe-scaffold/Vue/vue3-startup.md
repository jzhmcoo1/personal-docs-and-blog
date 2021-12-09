# Vue3 入门

## 创建项目

### 使用 vue-cli 创建

[https://v3.cn.vuejs.org/guide/installation.html#vite](https://v3.cn.vuejs.org/guide/installation.html#vite)

### 使用 vite 创建

- ​[https://v3.cn.vuejs.org/guide/installation.html#vite](https://v3.cn.vuejs.org/guide/installation.html#vite)
- ​[https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)

```bash
yarn create vite my-vue-app --template vue
```

## 项目工程结构

### main.js

main.js

```json
import { createApp } from 'vue'; // 引入的是createApp工厂函数
import App from './App.vue';

// 创建应用实例对象,类似于之前Vue2中的vm，但更轻
const app = createApp(App);
console.log('app', app);
app.mount('#app'); // 挂载

/**
 * vue2写法
 *
 * const vm = new Vue({
 *    render: h=>h(App)
 * })
 * vm.$mount('#app')
 */
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/2553963/1638677599922-93cdf112-e76d-482a-a96e-7a974eb8b98e.png#clientId=u84952d61-78bc-4&from=paste&id=u51bf7213&margin=%5Bobject%20Object%5D&name=image.png&originHeight=393&originWidth=970&originalType=binary&ratio=1&size=74134&status=done&style=none&taskId=u1ba14f88-374e-4598-ac45-ff4263302fb)

### App.vue

```vue
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />
  <!-- 可以没有根标签了 -->
</template>
```

## setup 和组合式 api 入

[https://v3.cn.vuejs.org/guide/composition-api-introduction.html](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api)
摘录几段话可以了解到为什么有了组件式开发后，还需要组合式 api：

> 通过创建 Vue 组件，我们可以将界面中重复的部分连同其功能一起提取为可重用的代码段。仅此一项就可以使我们的应用在可维护性和灵活性方面走得相当远。然而，我们的经验已经证明，**光靠这一点可能并不够**，尤其是当你的应用变得非常大的时候——想想几百个组件。处理这样的大型应用时，共享和重用代码变得尤为重要。

> 使用 (data、computed、methods、watch) 组件选项来组织逻辑通常都很有效。然而，当我们的组件开始变得更大时，**逻辑关注点**的列表也会增长。尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解。

总结一下就是关注点分离

> 这种碎片化使得理解和维护复杂组件变得困难。选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块。
> 如果能够将**同一个逻辑关注点相关代码收集在一起会更好**。而这**正是组合式 API 使我们能够做到的。**

### setup 基本使用

```vue
<template>
  <h1>我是app组件</h1>
  <h2>{{ name }}</h2>
</template>

<script>
import { ref } from "vue";

export default {
  name: "App",
  setup() {
    const name = ref(0);

    return { name };
  },
};
</script>
```

在 setup 中，可以返回一个对象，该对象在模版语法中可以直接读取。
另外，不用 setup，vue2 的方式也可以实现

```vue
<template>
  <h1>我是app组件</h1>
  <h2>{{ name }}</h2>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      name: "hello",
    };
  },
};
</script>
```

### setup 的执行时机

1. 试试在 setup 中读取 data 中的数据

```vue
<template>
  <h1>我是app组件</h1>
  <h2>{{ name }}</h2>
  <button @click="readName">使用vue3读取vue2 data中的name</button>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      name: "hello",
    };
  },
  setup() {
    return {
      readName() {
        console.log(this.name); // undefined
      },
    };
  },
};
</script>
```

发现输出是 undefined

2. 试试在 setup 中的方法读取 data 中的数据

```vue
<template>
  <h1>我是app组件</h1>
  <h2>{{ name }}</h2>
  <button @click="readName">使用vue2的methods读取vue3的name</button>
</template>

<script>
export default {
  name: "App",
  methods: {
    readName() {
      console.log(this.name); // hello
    },
  },
  setup() {
    return {
      name: "hello",
    };
  },
};
</script>
```

是可以输出的。

> setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。

从这句话可以看出，set 是在组件实例创建之前被执行的，这样也就说明之前的例子：在 setup 中读取 data 的数据是 undefined，因为组件实例还没被创建。在 beforeCreate 前执行一次，且 this 为 undefined。

### setup 接收到的参数

[setup 参数](https://v3.cn.vuejs.org/guide/composition-api-setup.html#%E5%8F%82%E6%95%B0)

```javascript
setup(props, context);
```

> 执行 setup 时，组件实例尚未被创建。因此，你只能访问以下 property：
>
> - props
> - attrs
> - slots
> - emit
>
> 换句话说，你**将无法访问**以下组件选项：
>
> - data
> - computed
> - methods
> - refs (模板 ref)

context 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 context 使用 ES6 解构。

```javascript
setup(props, { attrs, slots, emit, expose }) {}
```

### 使用 ref 创建响应式变量

```vue
<template>
  <h1>我是app组件</h1>
  <!-- 不变化 -->
  <h2>{{ count }}</h2>
  <button @click="click">点我加1</button>
</template>

<script>
export default {
  name: "App",
  setup() {
    let count = 0;

    const click = () => {
      count++;
      console.log(count); // 1 2 3...
    };

    return {
      count,
      click,
    };
  },
};
</script>
```

如果这么创建 count 变量，不是响应式的，点击按钮会发现值确实变了，但是页面没变，接下来引入 ref 来创建响应式变量：

```vue
<template>
  <h1>我是app组件</h1>
  <!-- 响应式 -->
  <h2>{{ count }}</h2>
  <button @click="click">点我加1</button>
</template>

<script>
import { ref } from "vue";
export default {
  name: "App",
  setup() {
    let count = ref(0);

    const click = () => {
      count.value++;
      console.log(count);
    };

    return {
      count,
      click,
    };
  },
};
</script>
```

修改 count 时，需要修改里面的 value 属性，我们可以打印一下看看被 ref 包裹所返回的响应式变量究竟是个啥：

```javascript
RefImpl {_shallow: false, dep: Set(1), __v_isRef: true, _rawValue: 1, _value: 1}
```

是一个`RefImpl`的实例对象(引用实现对象，简称引用对象)
打开这个对象，可以发现 value 的值是`...`
![image.png](https://cdn.nlark.com/yuque/0/2021/png/2553963/1638694768667-8137cc2f-a83e-4f6a-a76d-4833dc51c6b7.png#clientId=u84952d61-78bc-4&from=paste&id=u1186bea8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=187&originWidth=297&originalType=binary&ratio=1&size=20316&status=done&style=none&taskId=ucedf8acf-a4da-4ea9-90ec-6312872e310)
点开 Prototype 可以发现，setter getter 方法被放在原型对象里了。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/2553963/1638694817446-cae68111-3f1f-4b18-bafe-ee23cd1abdbb.png#clientId=u84952d61-78bc-4&from=paste&height=139&id=uc820c82d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=277&originWidth=781&originalType=binary&ratio=1&size=39298&status=done&style=none&taskId=ub6196518-8169-46a3-8bf5-87511ccab7d&width=390.5)
为什么在 template 中的值，不需要使用`.value`读取？vue3 发现是`RefImpl`实例对象，自动会解析。

#### 使用 ref 包裹对象

```vue
<template>
  <h1>我是app组件</h1>
  <!-- 响应式 -->
  <h2>{{ job.type }}</h2>
  <h2>{{ job.salary }}</h2>
  <button @click="click">点我切换</button>
</template>

<script>
import { ref } from "vue";
export default {
  name: "App",
  setup() {
    const job = ref({
      type: "前端工程师",
      salary: "30K",
    });

    const click = () => {
      console.log(job);
      job.value.type = "UI设计师";
    };

    return {
      click,
      job,
    };
  },
};
</script>
```

输出内容：

```javascript
RefImpl {_shallow: false, dep: Set(1), __v_isRef: true, _rawValue: {…}, _value: Proxy}
dep: Set(1) {ReactiveEffect}
__v_isRef: true
_rawValue: {type: 'UI设计师', salary: '30K'}
_shallow: false
_value: Proxy {type: 'UI设计师', salary: '30K'}
value: (...)
[[Prototype]]: Object
```

发现`_value`是一个`Proxy`实例对象
ref 包裹一个对象，使用到了一个`reactive`函数

### 使用 reactive 创建响应式对象

首先，`reactive`不能包裹基本类型

```vue
<script>
import { reactive } from "vue";
export default {
  setup() {
    const a = reactive(1);
    return {
      a,
    };
  },
};
</script>
```

会有如下 warning：

```
value cannot be made reactive: 1
```

我们将原来的 job 对象改成使用 reactive 包裹：会发现他不需要`.value`来访问对象的值了

```vue
<script>
import { reactive } from "vue";
export default {
  name: "App",
  setup() {
    const job = reactive({
      type: "前端工程师",
      salary: "30K",
    });

    const click = () => {
      console.log(job);
      job.type = "UI设计师";
    };

    return {
      click,
      job,
    };
  },
};
</script>
```

打印出来`job`，可以发现它是`proxy`的实例对象：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/2553963/1638709176814-74f5a3b7-3b4a-4fa6-86c8-6a8e912dfb7f.png#clientId=u84952d61-78bc-4&from=paste&height=31&id=u1a6a2a0c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=62&originWidth=844&originalType=binary&ratio=1&size=14020&status=done&style=none&taskId=u52a26e07-a609-4904-9cf6-dbe42a21604&width=422)

### reactive 与 ref 对比

|          | `ref`                                                                          | `reactive`                                                                             |
| -------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| 定义数据 | 定义基本类型数据（也可以定义数组或对象，内部会自动通过`reactive`转换为 proxy） | 定义对象（或数组）                                                                     |
| 原理角度 | `ref`通过`Object.defineProperty()`的 get、set 来实现响应式（数据劫持）         | `reactive`通过使用 Proxy 来实现响应式（数据劫持，并通过 Reflect 操作源对象内部的数据） |
| 使用角度 | `ref`定义的数据，操作时需要使用`.value`，在模版中读取数据时不需要。            | `reactive`定义的数据，操作数据与读取数据均不需要`.value`                               |

## Vue3.0 的响应式原理

### Vue2.0 响应式回顾

- 实现原理：
  - 对象类型：通过`Object.defineProperty()`对属性的读取和修改进行拦截（数据劫持）
  - 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）

```javascript
Object.defineProperty(data, "count", {
  get() {},
  set() {},
});
```

- 存在的问题：
  - 新增属性、删除属性，界面不会更新（解决方式，使用`$set(),$delete()`）
  - 直接通过数组下标修改数组，界面不会自动更新（解决方式，使用`$set(),或者使用splice`）

模拟实现：

```javascript
let person = {
  name: "张三",
  age: 18,
};

// 模拟vue2的响应式
let p = {};
Object.defineProperty(p, "name", {
  get() {
    return person.name;
  },
  set(newVal) {
    console.log("发现有人修改了name，去修改ui。。。");
    person.name = newVal;
  },
  configurable: true,
});

p.name = "李四"; // 捕获到了
p.sex = "男"; // 捕获不到
console.log(delete p.name); // true, 但捕获不到
```

### Vue3.0 的响应式

- 实现原理：
  - 通过 Proxy：拦截对象中任意属性的变化，包括：属性的读写、属性的添加、属性的删除等。
  - 通过 Reflect：对被代理对象的属性进行操作。

```javascript
let person = {
  name: "张三",
  age: 18,
};

const p = new Proxy(person, {
  // get 接受到三个参数，被代理的对象（源对象）、需要获取的属性、代理对象（proxy实例）
  get(target, property, proxy) {
    console.log(`有人读取了person的${property}属性`);
    return Reflect.get(target, property);
  },
  // set可以是修改和增加属性
  set(target, property, newVal) {
    console.log(`有人修改了person的${property}属性，要去更新ui了。。。`);
    return Reflect.set(target, property, newVal);
  },
  // delete是删除某个属性
  deleteProperty(target, property) {
    console.log(`有人删除了person的${property}属性，要去更新ui了。。。`);
    return Reflect.deleteProperty(target, property);
  },
});
```

扩展阅读：[比较 Reflect 和 Object 上的方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)

### 补充：为什么需要 Reflect？确保修改对象属性时的 this 指向

参考链接：[Reflect.get()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get)

> **如果 target 对象中指定了 getter，receiver 则为 getter 调用时的 this 值。**

查看这样一个例子：

```javascript
let user = {
  _name: "张三",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop);
    // return target[prop]; // (*) target = user
  },
});

let admin = {
  __proto__: userProxy,
  _name: "李四",
};

// 期待 『李四』，却输出了 『张三』
console.log(admin.name); // => 张三
```

为什么会这样呢？改一下 Proxy 的 get，输出一下 target 和 receiver。

```javascript
get(target, prop, receiver) {
  console.log(user === target); // true
  console.log(admin === receiver); // true
  console.log(`有人读取了user上的${prop}属性`);
  // 如果target对象中指定了getter，receiver则为getter调用时的this值。
  // return Reflect.get(target, prop, receiver);
  return Reflect.get(target, prop); // 如果没有指定receiver，则this是target上的
},
```

所以为了使得 this 的指向为 receiver，需要在 Reflect.get 函数中传入第三个参数 receiver

```javascript
get(target, prop, receiver) {
  console.log(user === target); // true
  console.log(admin === receiver); // true
  // 如果target对象中指定了getter，receiver则为getter调用时的this值。
  return Reflect.get(target, prop, receiver);
},
```

## computed

简写形式，写一个函数：

```vue
<!-- app组件 父组件 -->
<template>
  <h1>我是app组件</h1>
  <label for="lastName">姓</label>
  <input name="lastName" type="text" v-model="person.lastName" />

  <label for="firstName">名</label>
  <input name="firstName" type="text" v-model="person.firstName" />
  <h3>{{ fullName }}</h3>
</template>

<script>
import { computed, reactive } from "vue";
export default {
  name: "App",
  setup() {
    const person = reactive({
      firstName: "三",
      lastName: "张",
    });

    const fullName = computed(() => person.lastName + person.firstName);

    return {
      person,
      fullName,
    };
  },
};
</script>
```

完整形式：配置 computed 的 get 和 set 方法

```vue
<template>
  <h1>我是app组件</h1>
  <label for="lastName">姓</label>
  <input name="lastName" type="text" v-model="person.lastName" />

  <label for="firstName">名</label>
  <input name="firstName" type="text" v-model="person.firstName" />
  <h3>{{ person.fullName }}</h3>
  <input name="firstName" type="text" v-model="person.fullName" />
</template>

<script>
import { computed, reactive } from "vue";
export default {
  name: "App",
  setup() {
    const person = reactive({
      firstName: "三",
      lastName: "张",
    });

    person.fullName = computed({
      get() {
        return person.lastName + "-" + person.firstName;
      },
      set(value) {
        [person.lastName, person.firstName] = value.split("-");
      },
    });

    return {
      person,
    };
  },
};
</script>
```

## watch

### 监听 ref 单个属性

```vue
<script setup>
import { ref } from "vue";
// 侦听一个 getter
const count = ref(0);
watch(count, (count, prevCount) => {
  console.log(count, prevCount);
});
</script>
```

### 监听 ref 多个属性

```vue
<script setup>
import { ref, watch } from "vue";
const firstName = ref("");
const lastName = ref("");

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues);
});

firstName.value = "John"; // logs: ["John", ""] ["", ""]
lastName.value = "Smith"; // logs: ["John", "Smith"] ["John", ""]
</script>
```

尽管如此，如果你在同一个函数里同时改变这些被侦听的来源，侦听器仍只会执行一次：

```vue
<template>
  <h1>我是app组件</h1>
  <button @click="changeValues">changeValues</button>
</template>

<script setup>
import { ref, watch } from "vue";
const firstName = ref("");
const lastName = ref("");

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues);
});

const changeValues = () => {
  firstName.value = "John";
  lastName.value = "Smith";
  // 打印 ["John", "Smith"] ["", ""]
};
</script>
```

可以使用 nextTick 使其分开执行

```vue
<script setup>
import { nextTick, ref, watch } from "vue";
const firstName = ref("");
const lastName = ref("");

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues);
});

const changeValues = async () => {
  firstName.value = "John";
  await nextTick();
  lastName.value = "Smith";
  // ['John', ''] ['', '']
  // ['John', 'Smith'] ['John', '']
};
</script>
```

### 监听一个 reactive 响应式对象

此处 deep 强制是开启的

```vue
<script setup>
import { watch, reactive } from "vue";

const obj = reactive({
  name: "123",
  a: {
    b: {
      c: {
        d: "ddd",
      },
    },
  },
});

watch(obj, (value, oldValue) => {
  console.log("obj被修改了");
  console.log(value);
  console.log("old", oldValue);
  console.log(value === oldValue); // true 无法获取oldValue，需要cloneDeep
});

obj.a.b.c.e = "eee";
</script>
```

### 监听一个 reactive 响应式对象中的某个属性

```vue
<script setup>
import { watch, reactive } from "vue";

const obj = reactive({
  name: "123",
  a: {
    b: {
      c: {
        d: "ddd",
      },
    },
  },
});

watch(
  () => obj.a.b, // 监听obj.a.b
  (value, oldValue) => {
    console.log("obj.a.b被修改了");
    console.log(value);
    console.log("old", oldValue);
    console.log(value === oldValue); // true
  },
  { deep: true } // 若不开启深度监听，无法捕获对象深层的变化
);

obj.a.b.c.e = "123";
</script>
```

使用侦听器来比较一个数组或对象的值，这些值是响应式的，**要求它有一个由值构成的副本**。

```vue
<script setup>
import { watch, reactive } from "vue";
const numbers = reactive([1, 2, 3, 4]);

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers);
  }
);

numbers.push(5); // logs: [1,2,3,4,5] [1,2,3,4]
</script>
```

```vue
<script setup>
import { watch, reactive } from "vue";

const obj = reactive({
  name: "123",
  a: {
    b: {
      c: {
        d: "ddd",
      },
    },
  },
});

watch(obj, (value, oldValue) => {
  console.log("obj被修改了");
  console.log(value);
  console.log("old", oldValue);
  console.log(value === oldValue); // true
});

obj.a.b.c.e = "123";
</script>
```

打印出来会发现 oldValue 和 value 是一样的，如果需要解决这个问题，需要使用 watch 传入一个深拷贝对象。

## watchEffect

```javascript
const count = ref(0);

watchEffect(() => console.log(count.value));
// -> logs 0

setTimeout(() => {
  count.value++;
  // -> logs 1
}, 100);
```

为了根据响应式状态*自动应用*和*重新应用*副作用，我们可以使用 watchEffect 函数。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

### 停止监听

当 watchEffect 在组件的 [setup()](https://v3.cn.vuejs.org/guide/composition-api-setup.html) 函数或[生命周期钩子](https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html)被调用时，侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。
在一些情况下，也可以显式调用返回值以停止侦听：

```javascript
const stop = watchEffect(() => {
  /* ... */
});

// later
stop();
```

### 清除副作用

有时副作用函数会执行一些异步的副作用，这些响应需要在其失效时清除 (即完成之前状态已改变了) 。所以侦听副作用传入的函数可以接收一个 onInvalidate 函数作入参，用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发：

- 副作用即将重新执行时
- 侦听器被停止 (如果在 setup() 或生命周期钩子函数中使用了 watchEffect，则在组件卸载时)

```javascript
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value);
  onInvalidate(() => {
    // id has changed or watcher is stopped.
    // invalidate previously pending async operation
    token.cancel();
  });
});
```

### 副作用刷新时机

Vue 的响应性系统会缓存副作用函数，并异步地刷新它们，这样可以避免同一个“tick” 中多个状态改变导致的不必要的重复调用。在核心的具体实现中，组件的 update 函数也是一个被侦听的副作用。当一个用户定义的副作用函数进入队列时，默认情况下，会在所有的组件 update 前执行：

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  setup() {
    const count = ref(0);

    watchEffect(() => {
      console.log(count.value);
    });

    return {
      count,
    };
  },
};
</script>
```

如果需要在组件更新(例如：当与[模板引用](https://v3.cn.vuejs.org/guide/composition-api-template-refs.html#%E4%BE%A6%E5%90%AC%E6%A8%A1%E6%9D%BF%E5%BC%95%E7%94%A8)一起)**后**重新运行侦听器副作用，我们可以传递带有 flush 选项的附加 options 对象 (默认为 'pre')：
flush 选项还接受 sync，这将强制效果始终同步触发。然而，这是低效的，应该很少需要。
从 Vue 3.2.0 开始，watchPostEffect 和 watchSyncEffect 别名也可以用来让代码意图更加明显。

## 生命周期钩子

![image.png](https://cdn.nlark.com/yuque/0/2021/png/2553963/1638801839450-d907504e-fa61-4d55-a481-0784b2e92590.png#clientId=u457ac7e8-aeec-4&from=paste&id=u8809f334&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1388&originWidth=838&originalType=binary&ratio=1&size=102878&status=done&style=stroke&taskId=u7110dd5e-35b5-4775-8073-6d903d82b03)

## 自定义 hook

创建 hooks/usePoint.js 文件，编写一个独立的逻辑，里面封装了自己的 setup：

```jsx
import { reactive, onMounted, onBeforeUnmount } from "vue";
export default function usePoint() {
  const point = reactive({
    x: 0,
    y: 0,
  });

  const savePoint = (event) => {
    point.x = event.pageX;
    point.y = event.pageY;
  };

  onMounted(() => {
    window.addEventListener("click", savePoint);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("click", savePoint);
  });

  return point;
}
```

在想要使用此逻辑的文件中引入，直接调用 usePoint

```vue
<template>
  <h1>我是Demo组件</h1>
  <h2>当前鼠标点击位置为：x:{{ point.x }}, y:{{ point.y }}</h2>
</template>

<script>
import usePoint from "../hooks/usePoint";
export default {
  setup() {
    const point = usePoint();

    return { point };
  },
};
</script>
```

## toRef 和 toRefs

- 作用：创建一个 ref 对象，其 value 指向另一个对象中的某个属性。
- 语法：`const name = toRef(person, 'name')`
- 应用：要将响应式对象中的某个属性单独提供给外部使用时
- 扩展：`toRefs`和`toRef`功能一致，但是可以批量创建多个`ref`，语法：`toRefs(person)`

## shallowRef 和 shallowReactive

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）
- shallowRef：只处理基本数据类型的响应式，不进行对象的响应式处理
- 使用场景：
  - 如果有一个对象数据，结构比较深，但变化的只是外层属性-> shallowReactive
  - 如果有一个对象数据，后序功能不会修改该对象中的属性，而是直接用新对象来替换->shallowRef

## shallowReadonly 和 readonly

- readonly：让一个响应式数据变成只读的（深只读）
- shallowReadonly：让一个响应式数据变为只读的（浅只读）
- 应用场景：不希望数据被修改时

## toRaw 和 markRow

toRaw：

- 作用：把响应式的数据变成普通数据（非响应式）
- 使用场景：用于读取响应式对象的普通对象，对这个普通对象的所有操作，不会引起页面更新

markRaw：

- 作用：标记一个对象，使其永远不会再成为响应式对象。
- 应用场景：
  1.  有些值不应被设置为响应式的，例如复杂的第三方类库等。
  1.  当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

## customRef

> 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 `track` 和 `trigger` 函数作为参数，并且应该返回一个带有 get 和 set 的对象。

实例：输入防抖

```vue
<template>
  <div>
    <input type="text" v-model="text" />
  </div>
</template>

<script>
import { reactive, toRefs, toRaw, customRef } from "vue";

export default {
  setup() {
    const useDebounce = (value, delay = 500) => {
      let timeout;
      return customRef((track, trigger) => {
        return {
          get() {
            track(); // 通知Vue追踪value变化
            return value;
          },
          set(newValue) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              value = newValue;
              trigger(); // 通知Vue重新解析模板
            }, delay);
          },
        };
      });
    };
    return { text: useDebounce("") };
  },
};
</script>
```
