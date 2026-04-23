PROJECT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." &> /dev/null && pwd)

export PGVIEW_HOST=localhost
export PGVIEW_PORT=5432
export PGVIEW_USER=guest
export PGVIEW_PASSWORD=guest
export PGVIEW_DBNAME=postgres
export VITE_PGVIEW_VERSION=v0.0.0

docker stop postgres
docker rm postgres
docker run --name postgres \
  -e POSTGRES_USER=$PGVIEW_USER \
  -e POSTGRES_PASSWORD=$PGVIEW_PASSWORD \
  -e POSTGRES_DB=$PGVIEW_DBNAME \
  -p $PGVIEW_PORT:$PGVIEW_PORT \
  -d postgres:18.3-alpine

until docker exec postgres pg_isready -U $PGVIEW_USER; do
  sleep 1
done

docker exec -i postgres psql -U $PGVIEW_USER -d $PGVIEW_DBNAME < "$PROJECT_DIR/scripts/init.sql"

bun install
bun run dev