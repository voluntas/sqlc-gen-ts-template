import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createAccountLogQuery = `-- name: CreateAccountLog :exec
INSERT INTO account_log (tag, data)
VALUES ($1, $2)`;

export interface CreateAccountLogArgs {
    tag: string;
    data: any;
}

export async function createAccountLog(client: Client, args: CreateAccountLogArgs): Promise<void> {
    await client.query({
        text: createAccountLogQuery,
        values: [args.tag, args.data],
        rowMode: "array"
    });
}

