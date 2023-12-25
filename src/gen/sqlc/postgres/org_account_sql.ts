import { Sql } from "postgres";

export const createOrgAccountQuery = `-- name: CreateOrgAccount :exec
INSERT INTO org_account (org_pk, account_pk)
VALUES ($1, $2)`;

export interface CreateOrgAccountArgs {
    orgPk: number;
    accountPk: number;
}

export async function createOrgAccount(sql: Sql, args: CreateOrgAccountArgs): Promise<void> {
    await sql.unsafe(createOrgAccountQuery, [args.orgPk, args.accountPk]);
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

export async function getOrgAccount(sql: Sql, args: GetOrgAccountArgs): Promise<GetOrgAccountRow | null> {
    const rows = await sql.unsafe<GetOrgAccountRow[]>(getOrgAccountQuery, [args.orgId, args.accountId]);
    if (rows.length !== 1) {
        return null;
    }
    return rows[0];
}

