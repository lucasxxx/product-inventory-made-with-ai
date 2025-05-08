# Product Inventory Monorepo

A modern product inventory application built with a monorepo architecture, featuring:

- **Frontend:** Next.js 14 with TypeScript and Tailwind CSS 4.1
- **Backend:** NestJS with TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Monorepo Tooling:** Turborepo
- **Containerization:** Docker

---

## Project Structure
product-inventory/
├── apps/
│ ├── frontend/ # Next.js app with Tailwind CSS
│ └── backend/ # NestJS app
├── packages/
│ ├── eslint-config/ # Shared ESLint configuration
│ ├── shared-types/ # Shared TypeScript types
│ └── typescript-config/ # Shared TypeScript configuration
├── docker-compose.yml
├── turbo.json
└── README.md


---

## Getting Started

## Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- npm >= 9.0.0

### 1. Clone the repository

```sh
git clone git@github.com:lucasxxx/product-inventory-made-with-ai.git
cd product-inventory
```

### 2. Start PostgreSQL with Docker

```sh
docker-compose up -d
```

### 3. Set up 

```sh
npm install
# Set your DATABASE_URL in .env (see .env.example)
cd apps/backend
npx prisma migrate dev
npx prisma migrate dev
```


### 5. Seeding the Database

After running your migrations, you can populate your database with 100 fake products using the seed script:
```sh
cd apps/backend
npm run seed
```
This will use the factory and seeder to insert sample products into your PostgreSQL database.

---

### 6. Running the project

On the root folder just run
```sh
npm run dev
```
This will start all servers

---

## Environment Variables

- Copy `.env.example` to `.env` in `apps/backend` and `apps/frontend` and fill in your values.

---

## License

MIT