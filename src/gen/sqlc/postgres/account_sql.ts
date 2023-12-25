import { Sql } from "postgres";

export const getAccountQuery = `-- name: GetAccount :one
SELECT pk, id, display_name, email, created_at
FROM account
WHERE id = $1`;

export interface GetAccountArgs {
    id: string;
}

export interface GetAccountRow {
    pk: number;
    id: string;
    displayName: string;
    email: string | null;
    createdAt: Date;
}

export async function getAccount(sql: Sql, args: GetAccountArgs): Promise<GetAccountRow | null> {
    const rows = await sql.unsafe<GetAccountRow[]>(getAccountQuery, [args.id]);
    if (rows.length !== 1) {
        return null;
    }
    return rows[0];
}

export const listAccountsQuery = `-- name: ListAccounts :many
SELECT pk, id, display_name, email, created_at
FROM account`;

export interface ListAccountsRow {
    pk: number;
    id: string;
    displayName: string;
    email: string | null;
    createdAt: Date;
}

export async function listAccounts(sql: Sql): Promise<ListAccountsRow[]> {
    return await sql.unsafe<ListAccountsRow[]>(listAccountsQuery, []);
}

export const createAccountQuery = `-- name: CreateAccount :exec
INSERT INTO account (id, display_name, email)
VALUES ($1, $2, $3)`;

export interface CreateAccountArgs {
    id: string;
    displayName: string;
    email: string | null;
}

export async function createAccount(sql: Sql, args: CreateAccountArgs): Promise<void> {
    await sql.unsafe(createAccountQuery, [args.id, args.displayName, args.email]);
}

export const updateAccountDisplayNameQuery = `-- name: UpdateAccountDisplayName :one
UPDATE account
SET display_name = $1
WHERE id = $2
RETURNING pk, id, display_name, email, created_at`;

export interface UpdateAccountDisplayNameArgs {
    displayName: string;
    id: string;
}

export interface UpdateAccountDisplayNameRow {
    pk: number;
    id: string;
    displayName: string;
    email: string | null;
    createdAt: Date;
}

export async function updateAccountDisplayName(sql: Sql, args: UpdateAccountDisplayNameArgs): Promise<UpdateAccountDisplayNameRow | null> {
    const rows = await sql.unsafe<UpdateAccountDisplayNameRow[]>(updateAccountDisplayNameQuery, [args.displayName, args.id]);
    if (rows.length !== 1) {
        return null;
    }
    return rows[0];
}

export const deleteAccountQuery = `-- name: DeleteAccount :exec
DELETE FROM account
WHERE id = $1`;

export interface DeleteAccountArgs {
    id: string;
}

export async function deleteAccount(sql: Sql, args: DeleteAccountArgs): Promise<void> {
    await sql.unsafe(deleteAccountQuery, [args.id]);
}

