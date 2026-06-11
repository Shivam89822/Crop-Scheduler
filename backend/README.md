# Crop Scheduler Backend

Express + MongoDB backend scaffold for the Crop Scheduler MVP.

## Structure

```text
backend/
├── src/
│   ├── config/        # env and database setup
│   ├── constants/     # enums and shared constants
│   ├── controllers/   # request handlers
│   ├── middleware/    # error and 404 middleware
│   ├── models/        # mongoose schemas
│   ├── routes/        # API route modules
│   ├── services/      # business logic and schedule engine
│   ├── utils/         # shared helpers
│   ├── validators/    # request validation helpers
│   ├── app.js         # express app configuration
│   └── server.js      # server bootstrap
├── .env.example
├── .gitignore
└── package.json
```

## Current API Base

- `GET /api/health`
- `POST /api/farms`
- `GET /api/farms`
- `POST /api/crops`
- `GET /api/crops`
- `GET /api/crops/:id`
- `GET /api/tasks`
- `GET /api/tasks/today`
- `PATCH /api/tasks/:id/complete`

## Next Steps

1. Run `npm install`
2. Copy `.env.example` to `.env`
3. Start MongoDB
4. Run `npm run dev`
5. Build the real crop schedule templates for chilli and cotton

## MVP Data Flow

Current MVP flow is:

`Farm -> Crop -> Tasks`

User/auth entities can be added later without blocking schedule generation work.
