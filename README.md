# Product Inventory Monorepo

This is a monorepo for a production-ready Product Inventory application, built with:

- **Frontend:** Next.js (TypeScript)
- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Monorepo Tooling:** Turborepo
- **Containerization:** Docker

---

## Project Structure
product-inventory/
├── apps/
│ ├── frontend/ # Next.js app
│ └── backend/ # NestJS app
├── packages/ # (optional: shared code/config)
├── docker-compose.yml
├── turbo.json
└── README.md


---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd product-inventory
```

### 2. Start PostgreSQL with Docker

```sh
docker-compose up -d
```

### 3. Set up the backend

```sh
cd apps/backend
npm install
# Set your DATABASE_URL in .env (see .env.example)
npx prisma migrate dev
npm run start:dev
```

### 4. Set up the frontend

```sh
cd apps/frontend
npm install
npm run dev
```

---

## Environment Variables

- Copy `.env.example` to `.env` in `apps/backend` and fill in your values.

---

## Scripts

- `docker-compose up -d` — Start PostgreSQL database
- `npm run start:dev` (in backend) — Start NestJS server
- `npm run dev` (in frontend) — Start Next.js app

---

## License

MIT