PROJECT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." &> /dev/null && pwd)

docker stop postgres
docker rm postgres
docker run --name postgres \
  -e POSTGRES_USER=guest \
  -e POSTGRES_PASSWORD=guest \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:18.3-alpine

until docker exec postgres pg_isready -U guest; do
  sleep 1
done

docker exec -i postgres psql -U guest -d postgres < "$PROJECT_DIR/scripts/init.sql"

pnpm install --prefix "$PROJECT_DIR"

export PGVIEW_DB_HOST=localhost
export PGVIEW_DB_PORT=5432
export PGVIEW_DB_USER=guest
export PGVIEW_DB_PASSWORD=guest
export PGVIEW_DB_NAME=postgres

concurrently "pnpm --filter @pgview/backend dev" "pnpm --filter @pgview/frontend dev"