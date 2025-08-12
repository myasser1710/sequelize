# Sequelize Node.js Backend — README

This is a pragmatic, production-minded Express + Sequelize backend built with modern Node.js (ESM) and MySQL. The codebase emphasizes correctness, explicit migrations, input validation, secure password handling, and a consistent response contract.

## Table of Contents
- Business Logic
- Tech Stack
- Architecture & Conventions
- Getting Started
- Environment Configuration
- Database & Migrations
- Running the Service
- Data Model & Associations
- API Overview
- Validation, Security, and Error Handling
- Operational Notes
- Resources


## Business Logic
Think of this as the backend for a small, thoughtful community where people write posts and talk in the comments. The rules are simple and fair:

- People sign up (as regular users or admins), write posts, and start conversations.
- Others join in with comments. If you wrote it, you control it — you can edit your comment; you can delete your own post.
- We keep the rails up: data is validated before it hits the database, and relationships between users, posts, and comments are always consistent.
- Passwords are treated with respect: they’re hashed and only re‑hashed when changed.
- The read side is practical: you can search comments by text, pull the newest comments for a post, and see post/comment rollups where helpful.

In short: a clean, predictable API that encodes real‑world expectations — ownership, safety, and clarity — without getting in your way.



## Tech Stack
- Node.js (type: module)
- Express
- Sequelize ORM (MySQL)
- express-validator
- Security/ops middleware: helmet, cors, express-rate-limit, morgan

## Architecture & Conventions
- ESM project: `"type": "module"` in `package.json`.
- Source layout under `src/`:
  - `src/index.js` — App bootstrap
  - `src/DB/` — Database layer
    - `Models/` — Sequelize models
    - `migrations/` — Sequelize CLI migrations
    - `seeders/` — Seed scripts (optional)
    - `config/` — Sequelize CLI config JSON (env-backed recommended)
  - `src/Modules/<Domain>/` — Feature modules (controller + service)

Conventions:
- Controllers own validation and HTTP semantics.
- Services encapsulate business logic and data access.
- Responses follow `{ success, message, data }` on success and `{ success: false, message, error }` on failure.

## Getting Started
Prerequisites:
- Node.js 18+
- MySQL 8+

Install dependencies:
```
npm install
```

Create a `.env` file (see below) and ensure your database exists.

## Environment Configuration
Environment variables (suggested):
```
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
DB_DIALECT=mysql
```

## Database & Migrations
Migrations live in `src/DB/migrations/`. 

Examples:
```
# Apply migrations
npx sequelize-cli db:migrate \
 --config src/DB/config/config.json \
 --migrations-path src/DB/migrations \
 --models-path src/DB/Models \
 --seeders-path src/DB/seeders

## Running the Service
Start the server:
```
npm start
# or if you prefer a dev watcher (if configured):
npm run dev
```

By default, the app listens on `PORT` or 3000. See `src/index.js` for middleware and route mounting.

## Data Model & Associations
- User: `name`, `email` (unique), `password` (hashed), `role` (`user|admin`)
- Post: `title`, `content`, `fkUserId`
- Comment: `content`, `fkPostId`, `fkUserId`

Associations (defined in the models):
- `User.hasMany(Post, { as: 'user_posts_data', foreignKey: 'fkUserId' })`
- `Post.belongsTo(User, { as: 'post_author_data', foreignKey: 'fkUserId' })`
- Comments are linked to both User and Post via FKs (see models/migrations).

## API Overview
Routes are mounted in `src/index.js`:
- `/users` — `src/Modules/Users/user.controller.js`
- `/posts` — `src/Modules/Posts/post.controller.js`
- `/comments` — `src/Modules/Comments/comment.controller.js`

Users
- POST `/users/create-user` — create user (name, email, password, role)
- PUT `/users/create-or-update/:id` — upsert fields, password rehashed if provided
- GET `/users/find-by-email?email=...`
- GET `/users/find-by-pk/:id`

Posts
- POST `/posts` — create post (title, content, userId)
- DELETE `/posts/:postId/user/:userId` — delete post (ownership enforced)
- GET `/posts/details` — list posts (see implementation)
- GET `/posts/comment-count` — post -> comment counts

Comments
- POST `/comments` — bulk create comments `[{ content, fkPostId, fkUserId }, ...]`
- PATCH `/comments/:commentId` — update one comment (author enforced)
- POST `/comments/find-or-create` — idempotent create
- GET `/comments/search?word=...` — content LIKE search
- GET `/comments/newest/:postId` — most recent comments for post
- GET `/comments/details/:commentId` — comment details

All endpoints use `express-validator` and return consistent JSON envelopes.

## Validation, Security, and Error Handling
- Input validation at controllers via `express-validator`.
- Password hashing via `bcrypt` in model hooks; updates rehash only when changed.
- Security middleware: `helmet`, `cors`, `express-rate-limit`.
- Logging via `morgan` (dev-friendly), standard error handling middleware.

## Resources
- Postman collection:
  https://mohamedyasser-379226.postman.co/workspace/mohamed-yasser's-Workspace~db8f48b5-3571-4331-8e17-2955fe4d5b1e/collection/45702516-26cb60e8-1e9c-451b-8723-bfb3fa4dfe8b?action=share&creator=45702516

