import postgres from 'postgres'
import { GenericContainer, Wait } from 'testcontainers'
import { expect, test } from 'vitest'

import fs from 'fs'
import {
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
} from '../src/gen/sqlc/postgres/account_sql'

test('account', async () => {
  // PostgreSQL コンテナを起動
  const container = await new GenericContainer('postgres:latest')
    .withEnvironment({
      POSTGRES_DB: 'testdb',
      POSTGRES_USER: 'user',
      POSTGRES_PASSWORD: 'password',
    })
    .withExposedPorts(5432)
    // TCPポートが利用可能になるまで待機
    .withWaitStrategy(Wait.forListeningPorts())
    .start()

  // postgres クライアントの設定
  const sql = postgres({
    host: container.getHost(),
    port: container.getMappedPort(5432),
    database: 'testdb',
    username: 'user',
    password: 'password',
  })

  // データベースへの ping (接続テスト)
  await sql`SELECT 1`

  // ファイルを読み込んでSQL文を取得
  const schemaSQL = fs.readFileSync('db/schema.sql', 'utf-8')

  // スキーマの初期化
  await sql.unsafe(schemaSQL)

  await createAccount(sql, { id: 'spam', displayName: 'Egg', email: 'ham@example.com' })

  const account = await getAccount(sql, { id: 'spam' })
  expect(account).not.toBeNull()
  if (account) {
    expect(account.id).toBe('spam')
    expect(account.displayName).toBe('Egg')
    expect(account.email).toBe('ham@example.com')
  }

  await deleteAccount(sql, { id: 'spam' })

  const accounts = await listAccounts(sql)
  expect(accounts.length).toBe(0)

  await sql.end()

  // コンテナを停止
  await container.stop()
}, 30_000)
