import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createOrgAccountQuery = `-- name: CreateOrgAccount :exec
INSERT INTO org_account (org_pk, account_pk)
VALUES ($1, $2)`;

export interface CreateOrgAccountArgs {
    orgPk: number;
    accountPk: number;
}

export async function createOrgAccount(client: Client, args: CreateOrgAccountArgs): Promise<void> {
    await client.query({
        text: createOrgAccountQuery,
        values: [args.orgPk, args.accountPk],
        rowMode: "array"
    });
}

export const getOrgAccountQuery = `-- name: GetOrgAccount :one
SELECT account.pk, account.id, account.display_name, account.email, account.created_at,
  org.pk, org.id, org.display_name, org.created_at
FROM account
  JOIN org_account ON account.pk = org_account.account_pk
  JOIN org ON org_account.org_pk = org.pk
WHERE org.id = $1
  AND account.id = $2`;

export interface GetOrgAccountArgs {
    orgId: string;
    accountId: string;
}

export interface GetOrgAccountRow {
    account: string | null;
    org: string | null;
}

export async function getOrgAccount(client: Client, args: GetOrgAccountArgs): Promise<GetOrgAccountRow | null> {
    const result = await client.query({
        text: getOrgAccountQuery,
        values: [args.orgId, args.accountId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        account: row[0],
        org: row[1]
    };
}

