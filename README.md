# Book Management API

A RESTful API built with Node.js, Express, TypeScript, MongoDB, and Mongoose.

## Features

- JWT-based authentication via `POST /login`
- Protected CRUD endpoints for books
- Feed endpoint that returns ranked books for the authenticated user
- Library-based authorization
- MongoDB persistence with Mongoose
- Docker and Docker Compose support
- Automated tests with Mocha, Sinon, and Supertest

## Main Design Choices

- Only books have CRUD endpoints, as required.
- Users and libraries are preloaded using a seed script.
- Access control is enforced on all book operations, not just create/read, to avoid authorization gaps.
- `authorCountry` was added to the `Book` model so the feed rule _"Prioritize books by authors from the same country as the user"_ can be implemented explicitly and efficiently.
- The `/feed` endpoint uses MongoDB aggregation so ranking work is pushed into the database layer.
- Seeding is executed manually rather than on every container startup, to avoid unnecessary resets and to keep application startup cleaner and more production-like.

## Feed Assumption

To support the feed requirement of prioritizing books by authors from the same country as the authenticated user, this implementation assumes that each book stores an `authorCountry` field in the database.

This was added because the original entity definition includes only `author` as a string, which is not sufficient to determine the author’s country during feed calculation. Without this assumption, the same-country ranking rule cannot be implemented reliably or efficiently.

As a result, the feed logic compares `book.authorCountry` with `user.country`, and then applies the weighted relevance score on the matching result set.

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT
- Docker
- Mocha + Sinon + Supertest

## Environment Variables

Copy `.env.example` to `.env` and adjust values if needed.

```bash
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/book-api
JWT_SECRET=super-secret-key
```

## Run with Docker Compose

Build and start the services:

```bash
docker compose up --build -d
```

Seed the database:

```bash
docker compose run --rm app npm run seed
```

View logs:

```bash
docker compose logs -f app
```

The API will be available at:

```text
http://localhost:3000
```

## Run Locally

1. Start MongoDB locally.
2. Install dependencies:

```bash
npm install
```

3. Create `.env` from `.env.example`
4. Seed the database:

```bash
npm run seed
```

5. Start the app in development mode:

```bash
npm run dev
```

## Test

Make sure MongoDB is running and `MONGO_URI` points to a testable database.
Also, install dependencies (npm install) before running test.

```bash
npm test
```


Manual endpoint checks can also be run from the HTTP Client file (supported by IDE's such as JetBrains):

```test/manual-http-cases.http```

### Admin user

```json
{
  "username": "admin",
  "password": "password123",
  "country": "US"
}
```

### UK reader

```json
{
  "username": "reader_uk",
  "password": "password123",
  "country": "UK"
}
```

## Seeded Libraries

```json
[
  {
    "_id": "65f100000000000000000001",
    "name": "Central Library",
    "location": "New York"
  },
  {
    "_id": "65f100000000000000000002",
    "name": "West Coast Library",
    "location": "San Francisco"
  },
  {
    "_id": "65f100000000000000000003",
    "name": "European Library",
    "location": "Berlin"
  }
]
```

## Authentication

All `/books` and `/feed` endpoints require a bearer token:

```http
Authorization: Bearer <jwt>
```

### `POST /login`

Authenticates a predefined user and returns a signed JWT.

**Request body**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Success response — `200 OK`**

```json
{
  "token": "<jwt>"
}
```

**Error responses**
- `400 Bad Request` — invalid request body
- `401 Unauthorized` — invalid username or password

## Health Endpoint

### `GET /health`

Simple health-check endpoint for container orchestration and local verification.

**Success response — `200 OK`**

```json
{
  "status": "ok"
}
```

## Book Endpoints

### `POST /books`

Creates a new book in one of the authenticated user's libraries.

**Headers**
- `Authorization: Bearer <jwt>`

**Request body**

```json
{
  "title": "Node.js Patterns",
  "author": "Mario Casciaro",
  "authorCountry": "IT",
  "publishedDate": "2020-01-01",
  "pages": 526,
  "library": "65f100000000000000000001"
}
```

**Validation rules**
- `title` must be a non-empty string
- `author` must be a non-empty string
- `authorCountry` must be a non-empty string
- `publishedDate` must be a valid date
- `pages` must be a positive integer
- `library` must be a valid MongoDB ObjectId

**Success response — `201 Created`**

```json
{
  "_id": "661111111111111111111111",
  "title": "Node.js Patterns",
  "author": "Mario Casciaro",
  "authorCountry": "IT",
  "publishedDate": "2020-01-01T00:00:00.000Z",
  "pages": 526,
  "library": "65f100000000000000000001",
  "createdAt": "2026-04-02T10:00:00.000Z",
  "updatedAt": "2026-04-02T10:00:00.000Z",
  "__v": 0
}
```

**Error responses**
- `400 Bad Request` — validation failed
- `401 Unauthorized` — missing or invalid token
- `403 Forbidden` — user does not belong to the target library

---

### `GET /books`

Returns all books from libraries the authenticated user belongs to.

**Headers**
- `Authorization: Bearer <jwt>`

**Optional query parameters**
- `library` — filter books to a specific accessible library id

**Examples**

```http
GET /books
```

```http
GET /books?library=65f100000000000000000001
```

**Success response — `200 OK`**

```json
[
  {
    "_id": "661111111111111111111111",
    "title": "Distributed Systems in Practice",
    "author": "John Miller",
    "authorCountry": "US",
    "publishedDate": "1999-01-01T00:00:00.000Z",
    "pages": 700,
    "library": "65f100000000000000000001",
    "createdAt": "2026-04-02T10:00:00.000Z",
    "updatedAt": "2026-04-02T10:00:00.000Z",
    "__v": 0
  }
]
```

**Error responses**
- `401 Unauthorized` — missing or invalid token
- `403 Forbidden` — requested library is not accessible to the user

---

### `GET /books/:id`

Returns a single book by id if the authenticated user has access to its library.

**Headers**
- `Authorization: Bearer <jwt>`

**Path parameters**
- `id` — book id

**Example**

```http
GET /books/661111111111111111111111
```

**Success response — `200 OK`**

```json
{
  "_id": "661111111111111111111111",
  "title": "Distributed Systems in Practice",
  "author": "John Miller",
  "authorCountry": "US",
  "publishedDate": "1999-01-01T00:00:00.000Z",
  "pages": 700,
  "library": "65f100000000000000000001",
  "createdAt": "2026-04-02T10:00:00.000Z",
  "updatedAt": "2026-04-02T10:00:00.000Z",
  "__v": 0
}
```

**Error responses**
- `401 Unauthorized` — missing or invalid token
- `403 Forbidden` — user does not have access to the book's library
- `404 Not Found` — book does not exist

---

### `PUT /books/:id`

Updates a book if the authenticated user has access to it.

**Headers**
- `Authorization: Bearer <jwt>`

**Path parameters**
- `id` — book id

**Request body**
Any subset of the following fields can be sent:

```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "authorCountry": "US",
  "publishedDate": "2010-01-01",
  "pages": 640,
  "library": "65f100000000000000000002"
}
```

**Rules**
- At least one field must be provided
- If `library` is provided, the target library must also belong to the user
- The same validation rules from create apply to provided fields

**Success response — `200 OK`**

```json
{
  "_id": "661111111111111111111111",
  "title": "Updated Title",
  "author": "Updated Author",
  "authorCountry": "US",
  "publishedDate": "2010-01-01T00:00:00.000Z",
  "pages": 640,
  "library": "65f100000000000000000002",
  "createdAt": "2026-04-02T10:00:00.000Z",
  "updatedAt": "2026-04-02T10:05:00.000Z",
  "__v": 0
}
```

**Error responses**
- `400 Bad Request` — invalid payload or empty update body
- `401 Unauthorized` — missing or invalid token
- `403 Forbidden` — user cannot access the current or target library
- `404 Not Found` — book does not exist

---

### `DELETE /books/:id`

Deletes a book if the authenticated user has access to it.

**Headers**
- `Authorization: Bearer <jwt>`

**Path parameters**
- `id` — book id

**Success response — `204 No Content`**

No response body.

**Error responses**
- `401 Unauthorized` — missing or invalid token
- `403 Forbidden` — user does not have access to the book's library
- `404 Not Found` — book does not exist

## Feed Endpoint

### `GET /feed`

Returns ranked book recommendations for the authenticated user.

**Headers**
- `Authorization: Bearer <jwt>`

**Feed rules**
1. Include only books from libraries the user is a member of
2. Prioritize books by authors from the same country as the user
3. Rank remaining order by weighted relevance score:
   - 80% normalized number of pages
   - 20% normalized book age
4. Sort by relevance descending
5. Return an empty array when no accessible books exist

**Example**

```http
GET /feed
```

**Success response — `200 OK`**

```json
[
  {
    "_id": "661111111111111111111111",
    "title": "Distributed Systems in Practice",
    "author": "John Miller",
    "authorCountry": "US",
    "publishedDate": "1999-01-01T00:00:00.000Z",
    "pages": 700,
    "library": "65f100000000000000000001",
    "relevanceScore": 1
  },
  {
    "_id": "662222222222222222222222",
    "title": "Legacy Architectures",
    "author": "Robert Stone",
    "authorCountry": "US",
    "publishedDate": "1980-05-20T00:00:00.000Z",
    "pages": 300,
    "library": "65f100000000000000000002",
    "relevanceScore": 0.54
  }
]
```

**Success response when no books are found — `200 OK`**

```json
[]
```

**Error responses**
- `401 Unauthorized` — missing or invalid token

## Error Format

Validation errors return:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "path": "title",
      "message": "title is required"
    }
  ]
}
```

Application errors return:

```json
{
  "message": "You do not have access to this library"
}
```
