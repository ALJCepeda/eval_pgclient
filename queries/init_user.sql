REVOKE CONNECT ON DATABASE eval FROM PUBLIC;

GRANT CONNECT
ON DATABASE eval
TO $1;

REVOKE ALL
ON ALL TABLES IN SCHEMA public
FROM PUBLIC;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO $1;

ALTER DEFAULT PRIVILEGES
FOR USER $1
IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $1;
