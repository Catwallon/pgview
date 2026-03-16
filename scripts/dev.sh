PROJECT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." &> /dev/null && pwd)

export PGVIEW_DB_HOST=localhost
export PGVIEW_DB_PORT=5432
export PGVIEW_DB_USER=guest
export PGVIEW_DB_PASSWORD=guest
export PGVIEW_DB_NAME=postgres
export VITE_PGVIEW_VERSION=v0.0.0

docker stop postgres
docker rm postgres
docker run --name postgres \
  -e POSTGRES_USER=$PGVIEW_DB_USER \
  -e POSTGRES_PASSWORD=$PGVIEW_DB_PASSWORD \
  -e POSTGRES_DB=$PGVIEW_DB_NAME \
  -p $PGVIEW_DB_PORT:$PGVIEW_DB_PORT \
  -d postgres:18.3-alpine

until docker exec postgres pg_isready -U $PGVIEW_DB_USER; do
  sleep 1
done

docker exec -i postgres psql -U $PGVIEW_DB_USER -d $PGVIEW_DB_NAME < "$PROJECT_DIR/scripts/init.sql"

pnpm install --prefix "$PROJECT_DIR"

concurrently "pnpm --filter @pgview/backend dev" "pnpm --filter @pgview/frontend dev"