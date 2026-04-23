# PGView

A minimal and modern web-based PostgreSQL database viewer and editor.

> ⚠️ PGView is still in early development. Some features may be missing or incomplete.

![App preview](https://i.ibb.co/sv7KMVG1/1.png)
![Editor preview](https://i.ibb.co/SDQqbrFB/2.png)

## Features

- 🌳 Tree view of databases and tables
- 📄 Paginated rows
- 🔍 Search rows
- ✏️ Edit rows with a built-in JSON editor
- 🗑️ Delete rows

## Getting Started

### npm

```bash
# Install globally
npm install -g @catwallon/pgview

# Run
pgview --url postgresql://user:password@localhost:5432/mydb
```

### Docker

```bash
docker run -p 8080:8080 \
  -e PGVIEW_URL=postgresql://user:password@localhost:5432/mydb \
  catwallon/pgview
```

## Configuration

PGView can be configured via environment variables or CLI arguments.

| Environment variable | CLI argument    | Default     |
| -------------------- | --------------- | ----------- |
| `PGVIEW_HOST`        | `--host`        | `localhost` |
| `PGVIEW_PORT`        | `--port`        | `5432`      |
| `PGVIEW_DBNAME`      | `--dbname`      | —           |
| `PGVIEW_USER`        | `--user`        | —           |
| `PGVIEW_PASSWORD`    | `--password`    | —           |
| `PGVIEW_URL`         | `--url`         | —           |
| `PGVIEW_LISTEN_PORT` | `--listen-port` | `8080`      |

- CLI arguments take precedence over their corresponding environment variables.
- `PGVIEW_URL` / `--url` accept a full PostgreSQL connection string and take precedence over all individual parameters.
