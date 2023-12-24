import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createOrgQuery = `-- name: CreateOrg :exec
INSERT INTO org (id, display_name)
VALUES ($1, $2)`;

export interface CreateOrgArgs {
    id: string;
    displayName: string;
}

export async function createOrg(client: Client, args: CreateOrgArgs): Promise<void> {
    await client.query({
        text: createOrgQuery,
        values: [args.id, args.displayName],
        rowMode: "array"
    });
}

