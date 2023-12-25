import { Sql } from "postgres";

export const createAccountLogQuery = `-- name: CreateAccountLog :exec
INSERT INTO account_log (tag, data)
VALUES ($1, $2)`;

export interface CreateAccountLogArgs {
    tag: string;
    data: any;
}

export async function createAccountLog(sql: Sql, args: CreateAccountLogArgs): Promise<void> {
    await sql.unsafe(createAccountLogQuery, [args.tag, args.data]);
}

