import { Sql } from "postgres";

export const createOrgQuery = `-- name: CreateOrg :exec
INSERT INTO org (id, display_name)
VALUES ($1, $2)`;

export interface CreateOrgArgs {
    id: string;
    displayName: string;
}

export async function createOrg(sql: Sql, args: CreateOrgArgs): Promise<void> {
    await sql.unsafe(createOrgQuery, [args.id, args.displayName]);
}

