# Shudh Desi Ghee

Pure desi cow ghee & organic food e-commerce — UI inspired by [Rosier Foods](https://www.rosierfoods.com/), backend architecture from Surangi Naar (separate clone).

## Quick Start

```powershell
cd ecom/shudh-desi-ghee
docker compose up --build -d
```

| Service  | URL |
|----------|-----|
| Storefront | http://localhost:5174 |
| API | http://localhost:5001/api |
| Admin | http://localhost:5174/admin |

**Admin login:** `admin@shudhdesighee.com` / `admin123`

## Docs

- [IMPLEMENTATION.md](docs/IMPLEMENTATION.md) — phased plan
- [FEATURE-LIST.md](docs/FEATURE-LIST.md) — feature checklist
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design

## Commands

```powershell
docker compose logs -f
docker compose exec backend npm run seed
docker compose down
docker compose down -v   # fresh database
```

## Note

This project is **independent** of `surangi-naar-frontend`. Uses ports **5174** and **5001** to avoid conflicts.
