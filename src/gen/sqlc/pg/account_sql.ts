import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

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

export async function getAccount(client: Client, args: GetAccountArgs): Promise<GetAccountRow | null> {
    const result = await client.query({
        text: getAccountQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        pk: row[0],
        id: row[1],
        displayName: row[2],
        email: row[3],
        createdAt: row[4]
    };
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

export async function listAccounts(client: Client): Promise<ListAccountsRow[]> {
    const result = await client.query({
        text: listAccountsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            pk: row[0],
            id: row[1],
            displayName: row[2],
            email: row[3],
            createdAt: row[4]
        };
    });
}

export const createAccountQuery = `-- name: CreateAccount :exec
INSERT INTO account (id, display_name, email)
VALUES ($1, $2, $3)`;

export interface CreateAccountArgs {
    id: string;
    displayName: string;
    email: string | null;
}

export async function createAccount(client: Client, args: CreateAccountArgs): Promise<void> {
    await client.query({
        text: createAccountQuery,
        values: [args.id, args.displayName, args.email],
        rowMode: "array"
    });
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

export async function updateAccountDisplayName(client: Client, args: UpdateAccountDisplayNameArgs): Promise<UpdateAccountDisplayNameRow | null> {
    const result = await client.query({
        text: updateAccountDisplayNameQuery,
        values: [args.displayName, args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        pk: row[0],
        id: row[1],
        displayName: row[2],
        email: row[3],
        createdAt: row[4]
    };
}

export const deleteAccountQuery = `-- name: DeleteAccount :exec
DELETE FROM account
WHERE id = $1`;

export interface DeleteAccountArgs {
    id: string;
}

export async function deleteAccount(client: Client, args: DeleteAccountArgs): Promise<void> {
    await client.query({
        text: deleteAccountQuery,
        values: [args.id],
        rowMode: "array"
    });
}

