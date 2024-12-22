## 配置文件

**package.json**

> 关联字段

```json
{
  "name": "@app-fe/<name>",
  "remoteModule": {
    "displayName": "显示名称",
    "type": "module",
    "icon": "module-icon.svg",
    "adapter": "1.0.0",
    "sdk": "1.0.0"
  },
  "version": "0.0.0"
}
```

**生成 remote-manifest.json**

```json
{
  "adapter": "1.0.0",
  "displayName": "显示名称",
  "icon": "module-icon.svg",
  "name": "@app-fe/<name>",
  "sdk": "1.0.0",
  "type": "module",
  "version": "0.0.0"
}
```

## 样式隔离

基于 shadow dom 实现

## JS 沙箱

暂未实现

## 运行机制

```
@startuml

control store as Store
participant MainJS as MainJS
participant SDK as SDK
entity Module as Module
participant View as View

MainJS -> Module: load resource
Module -> View: mount
note right of View
执行 module 钩子, 将 module 挂载到 View
end note

View -> View: 自维护更新

group SDK
View -> SDK: 触发 SDK
SDK -> Store ++: update
Store -> SDK --: emit
SDK -> View: broadcast
note right of View
更新视图
end note
end

@enduml
```

## 生命周期

### onMounted

```ts
{
  onMounted: (props: {
    container: HTMLDivElement;
    query: Record<string, string>;
  }): void => {
    // ...
  };
}
```

### canDestroy

返回 Promise:

- fullfilled 状态时, 将正常卸载 module 视图, 执行 onDestroy
- rejected 状态时, 将阻止 module 视图卸载, 无法执行 onDestroy

```ts
{
  canDestroy: (): Proimise<null> | undefined => {
    // ...
  };
}
```

### onDestroy

此时已经完成对 module 视图的卸载

```ts
{
  onDestroy: (): void => {
    // ...
  };
}
```
