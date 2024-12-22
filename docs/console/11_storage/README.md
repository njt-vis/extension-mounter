## session storage

### 存储模型

```ts
interface SessionStorage {
  APP_ROUTE_HISTORY: {
    name: string;
    route: string;
  }[];
}
```

## local storage

```ts
interface LocalStorage {
  APP_TOKEN: string;
}
```
