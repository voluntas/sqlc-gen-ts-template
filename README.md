# sqlc-gen-ts-template

## タスク

- [x] [sqlc-gen-typescript](https://github.com/sqlc-dev/sqlc-gen-typescript) の利用
- [x] [Vitest](https://vitest.dev/) と [Testcontainers](https://testcontainers.com/) を利用したテストの実行
- [x] [pg](https://www.npmjs.com/package/pg) と [postgres](https://www.npmjs.com/package/postgres) の両方バージョンのテストを用意

## 気になること

- displayName が戻り値で display_name になってしまっている

## sqlc 実行

```bash
$ sqlc generate
```

## テスト実行

```bash
$ pnpm run test
```
