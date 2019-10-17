# 思路

因为 svelte 不能直接获取子组件（框架本身问题），所以只有用其他办法来实现嵌套的路由。

借鉴 Vue Router 的使用方式，要实现如下使用方式

```js
Router([
  {
    path: '/',
    component: Component,
    children: [
      {
        path: 'nest',
        component: Component
      },
      {
        path: 'nest2',
        component: Component
      }
    ]
  }
])
```

必须用到一些其他技巧来确定每个 Route 组件之间的关系

例如最终渲染结果为

```html
<Router>
  <div class="app">
    <Route route-id="1">
      <div class="sub route">
        <Route routeid="2" />
      </div>
    </Route>
  </div>
</Router>
```

就可以用 route-id 来确定每个 Route 之间的关系，Route#1 就是一级路由, Route#2 就是二级路由

路由之间关系确定了之后，然后匹配路由表进行更新，匹配更新方式：

1. 匹配路由表叶子节点 C
2. 然后根据 C 依次查找父节点，假设有 B,A
3. 然后依次对应更新 A,B,C（例如一级路由就更新为路由表中 A 节点的组件，对应的二级路由更新成 B 节点的组件，三级路由更新成 C 节点的组件）
