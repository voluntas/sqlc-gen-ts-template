-- name: CreateAccountLog :exec
INSERT INTO account_log (tag, data)
VALUES (@tag, @data);
