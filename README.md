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
  -e PGVIEW_DB_HOST=localhost \
  -e PGVIEW_DB_NAME=mydb \
  -e PGVIEW_DB_USER=myuser \
  -e PGVIEW_DB_PASSWORD=mypassword \
  catwallon/pgview
```

## Configuration

PGView can be configured via environment variables or CLI arguments.

| Environment variable | CLI argument | Default     |
| -------------------- | ------------ | ----------- |
| `PGVIEW_DB_HOST`     | `--host`     | `localhost` |
| `PGVIEW_DB_PORT`     | `--port`     | `5432`      |
| `PGVIEW_DB_NAME`     | `--name`     | —           |
| `PGVIEW_DB_USER`     | `--user`     | —           |
| `PGVIEW_DB_PASSWORD` | `--password` | —           |
| —                    | `--url`      | —           |

> `--url` accepts a full PostgreSQL connection string and takes precedence over individual parameters.
