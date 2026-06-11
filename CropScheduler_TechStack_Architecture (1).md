# 🌱 Crop Scheduler App — Industry-Level Tech Stack & Architecture Guide
**Crops: Chilli (Mirchi) & Cotton (Kapas) | Target: Farmers (Rural India)**

---

## 1. TECH STACK RECOMMENDATION

### Frontend — React Native (with Expo)
| Layer | Technology | Why |
|---|---|---|
| Framework | **React Native + Expo** | Single codebase for Android & iOS; 90% of Indian farmers use Android |
| Language | **TypeScript** | Type safety, better IDE support, scalable codebase |
| Navigation | **React Navigation v6** | Industry standard, supports deep linking |
| State Management | **Zustand** | Lightweight, simple, no boilerplate (better than Redux for this scale) |
| UI Library | **React Native Paper** | Material Design 3, accessible, farmable for regional audiences |
| Local DB | **WatermelonDB** | Offline-first reactive DB — critical for low-network rural areas |
| Notifications | **Expo Notifications + Firebase Cloud Messaging** | Push alerts for irrigation, spray, harvest reminders |
| Localization | **i18next + react-i18next** | Hindi, Marathi, Telugu, Gujarati support |
| Charts | **Victory Native** | Yield analytics, cost tracking visualizations |
| Weather API | **Open-Meteo (free) + IMD API** | Localized Indian weather data |

### Backend — Node.js + Express
| Layer | Technology | Why |
|---|---|---|
| Runtime | **Node.js + Express.js** | Your existing strength; fast REST API |
| Language | **TypeScript** | Type-safe backend |
| ORM | **Prisma** | Type-safe DB access, auto-migrations |
| Primary DB | **PostgreSQL** | Relational; crop schedules, users, farm data |
| Cache | **Redis** | Cache weather data, notifications queue |
| Job Scheduler | **BullMQ + Redis** | Daily cron for push notification dispatch |
| Auth | **JWT + Refresh Tokens** | Stateless auth with auto-refresh |
| File Storage | **Cloudinary / AWS S3** | Crop photos, disease images |
| Notifications | **Firebase Admin SDK** | Server-side push notification dispatch |

### DevOps & Deployment
| Layer | Technology |
|---|---|
| Hosting | **Railway.app / Render** (free tier → prod) |
| CI/CD | **GitHub Actions** |
| Monitoring | **Sentry** (error tracking) |
| App Distribution | **Expo EAS Build** → Google Play |

---

## 2. FOLDER STRUCTURE

### Mobile App (React Native)
```
crop-scheduler-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── dashboard.tsx       # Today's tasks
│   │   ├── calendar.tsx        # Crop calendar
│   │   ├── alerts.tsx          # Notifications
│   │   └── analytics.tsx       # Yield & cost charts
│   └── crop/
│       ├── [id]/schedule.tsx   # Crop-specific scheduler
│       └── add.tsx             # Add new crop
├── components/
│   ├── CropCard.tsx
│   ├── TaskCard.tsx
│   ├── WeatherWidget.tsx
│   ├── IrrigationAlert.tsx
│   └── PestWarningBanner.tsx
├── store/
│   ├── useAuthStore.ts
│   ├── useCropStore.ts
│   └── useNotificationStore.ts
├── services/
│   ├── api.ts                  # Axios instance
│   ├── weatherService.ts
│   └── notificationService.ts
├── db/
│   └── schema.ts               # WatermelonDB schema (offline)
├── i18n/
│   ├── en.json
│   ├── hi.json                 # Hindi
│   └── mr.json                 # Marathi
└── utils/
    ├── cropUtils.ts            # DAS/DAT calculations
    └── dateUtils.ts
```

### Backend (Node.js + Express)
```
crop-scheduler-backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── crop.routes.ts
│   │   ├── schedule.routes.ts
│   │   ├── notification.routes.ts
│   │   └── weather.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── scheduleEngine.ts   # Core: generates task schedule from sowing date
│   │   ├── weatherService.ts
│   │   └── notificationService.ts
│   ├── jobs/
│   │   └── dailyNotifier.ts    # BullMQ job: sends daily alerts
│   ├── prisma/
│   │   └── schema.prisma
│   └── middleware/
│       ├── auth.middleware.ts
│       └── errorHandler.ts
```

---

## 3. DATABASE SCHEMA (PostgreSQL via Prisma)

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  phone       String   @unique
  language    String   @default("hi")   // hi, mr, en, te, gu
  location    String                     // District/Taluka
  fcmToken    String?                   // Push notification token
  farms       Farm[]
  createdAt   DateTime @default(now())
}

model Farm {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  name      String  // "शेत नं. 1"
  area      Float   // in acres
  location  String
  crops     Crop[]
}

model Crop {
  id          String     @id @default(uuid())
  farmId      String
  farm        Farm       @relation(fields: [farmId], references: [id])
  type        CropType   // CHILLI | COTTON
  variety     String?    // e.g., "LCA 334", "Bt Cotton"
  sowingDate  DateTime
  status      CropStatus @default(ACTIVE)
  tasks       Task[]
  costLogs    CostLog[]
  yieldLogs   YieldLog[]
}

model Task {
  id          String     @id @default(uuid())
  cropId      String
  crop        Crop       @relation(fields: [cropId], references: [id])
  category    TaskCategory // IRRIGATION | FERTILIZER | PEST | HARVEST | NURSERY
  title       String
  description String?
  dueDate     DateTime
  dasDay      Int        // Days After Sowing
  isDone      Boolean    @default(false)
  priority    Priority   @default(MEDIUM)
  notified    Boolean    @default(false)
}

model CostLog {
  id        String   @id @default(uuid())
  cropId    String
  crop      Crop     @relation(fields: [cropId], references: [id])
  category  String   // Fertilizer, Pesticide, Labour, Water
  amount    Float
  date      DateTime
  notes     String?
}

model YieldLog {
  id       String   @id @default(uuid())
  cropId   String
  crop     Crop     @relation(fields: [cropId], references: [id])
  weight   Float    // in kg
  date     DateTime
  picking  Int      // Picking number (1st, 2nd, 3rd)
  notes    String?
}

enum CropType     { CHILLI COTTON }
enum CropStatus   { ACTIVE HARVESTED FAILED }
enum TaskCategory { NURSERY TRANSPLANTING IRRIGATION FERTILIZER PEST HARVEST }
enum Priority     { HIGH MEDIUM LOW }
```

---

## 4. SCHEDULE ENGINE — CORE LOGIC

This is the brain of the app. When a farmer adds a crop with a sowing date, the engine auto-generates all tasks:

```typescript
// services/scheduleEngine.ts
const CHILLI_SCHEDULE = [
  { das: 0,   category: 'NURSERY',      title: 'Seed Treatment',           priority: 'HIGH'   },
  { das: 7,   category: 'NURSERY',      title: 'Nursery Sowing',            priority: 'HIGH'   },
  { das: 35,  category: 'TRANSPLANTING',title: 'Transplanting Alert',       priority: 'HIGH'   },
  { das: 36,  category: 'IRRIGATION',   title: 'First Irrigation after Transplanting', priority: 'HIGH' },
  { das: 40,  category: 'FERTILIZER',   title: 'Basal Dose Application',    priority: 'HIGH'   },
  { das: 60,  category: 'PEST',         title: 'Thrips Monitoring',         priority: 'MEDIUM' },
  { das: 75,  category: 'FERTILIZER',   title: 'Nitrogen Top Dressing',     priority: 'MEDIUM' },
  { das: 90,  category: 'PEST',         title: 'Fruit Borer Scouting',      priority: 'HIGH'   },
  { das: 100, category: 'IRRIGATION',   title: 'Fruit Development Watering',priority: 'HIGH'   },
  { das: 110, category: 'FERTILIZER',   title: 'Micronutrient Spray',       priority: 'MEDIUM' },
  { das: 120, category: 'HARVEST',      title: 'First Picking',             priority: 'HIGH'   },
  { das: 135, category: 'HARVEST',      title: 'Second Picking',            priority: 'MEDIUM' },
];

const COTTON_SCHEDULE = [
  { das: -10, category: 'NURSERY',      title: 'Soil Testing',              priority: 'MEDIUM' },
  { das: 0,   category: 'NURSERY',      title: 'Seed Treatment & Sowing',   priority: 'HIGH'   },
  { das: 10,  category: 'NURSERY',      title: 'Germination Check',         priority: 'MEDIUM' },
  { das: 20,  category: 'FERTILIZER',   title: 'Basal Fertilizer Application',priority: 'HIGH' },
  { das: 35,  category: 'IRRIGATION',   title: 'Vegetative Stage Irrigation',priority: 'HIGH'  },
  { das: 45,  category: 'FERTILIZER',   title: 'Nitrogen Split Dose 1',     priority: 'HIGH'   },
  { das: 60,  category: 'PEST',         title: 'Whitefly Monitoring',       priority: 'HIGH'   },
  { das: 65,  category: 'PEST',         title: 'Pink Bollworm Alert',       priority: 'HIGH'   },
  { das: 80,  category: 'FERTILIZER',   title: 'Potash Application',        priority: 'MEDIUM' },
  { das: 90,  category: 'IRRIGATION',   title: 'Boll Development Irrigation',priority: 'HIGH'  },
  { das: 100, category: 'PEST',         title: 'Aphid & Jassid Scouting',   priority: 'MEDIUM' },
  { das: 150, category: 'HARVEST',      title: 'Harvest Readiness Check',   priority: 'HIGH'   },
  { das: 160, category: 'HARVEST',      title: 'First Picking',             priority: 'HIGH'   },
];

export function generateSchedule(cropType: 'CHILLI' | 'COTTON', sowingDate: Date) {
  const template = cropType === 'CHILLI' ? CHILLI_SCHEDULE : COTTON_SCHEDULE;
  return template.map(task => ({
    ...task,
    dueDate: addDays(sowingDate, task.das),
  }));
}
```

---

## 5. KEY SCREENS & USER FLOW

```
ONBOARDING
  Language Select (Hindi/Marathi/English)
  → Phone OTP Login
  → Add Farm (name, area, location)
  → Add Crop (Chilli/Cotton, variety, sowing date)
  → App auto-generates full schedule ✅

DASHBOARD (Home)
  - Today's Tasks (High priority first)
  - Weather Widget (local forecast)
  - Active Crops summary
  - Upcoming alerts (next 7 days)

CROP CALENDAR
  - Month view with task dots
  - Color coded: 🔴 Pest | 🔵 Irrigation | 🟡 Fertilizer | 🟢 Harvest
  - Tap date → see all tasks for that day

TASK DETAIL
  - Task description + photo guide
  - Mark as Done
  - Add notes / cost
  - Reschedule option

ANALYTICS
  - Cost breakdown (pie chart per category)
  - Yield per picking (bar chart)
  - Profit/Loss estimate
  - Export as PDF (for bank/insurance use)

ALERTS CENTER
  - All push notifications history
  - Weather-based alerts (rain expected → delay spray)
  - Pest outbreak warnings (zone-based)
```

---

## 6. OFFLINE-FIRST STRATEGY

Critical for rural farmers with low connectivity:

- All crop data, tasks, and schedule stored in **WatermelonDB** (SQLite on device)
- App works 100% offline — farmers can check tasks without internet
- Background sync with server when connection is available
- Weather data cached for 6 hours in Redis (backend) + AsyncStorage (app)
- Notifications queued on-device if FCM delivery fails

---

## 7. MULTILINGUAL NOTIFICATION EXAMPLES

```json
// hi.json (Hindi)
{
  "notification_irrigation": "सिंचाई करण्याची वेळ आली आहे! {{cropName}} ला पाणी द्या.",
  "notification_pest_thrips": "थ्रिप्स चे निरीक्षण करा. पिवळी चिकट सापळे लावा.",
  "notification_fertilizer": "खत देण्याची वेळ: {{dose}} {{cropName}} साठी आज द्या.",
  "notification_harvest": "पहिली तोडणी सुरू करा! {{cropName}} तयार आहे."
}
```

---

## 8. API ENDPOINTS

```
AUTH
  POST   /api/auth/send-otp
  POST   /api/auth/verify-otp

FARMS & CROPS
  GET    /api/farms                     # All farms for user
  POST   /api/farms                     # Add farm
  POST   /api/crops                     # Add crop → auto-generates schedule
  GET    /api/crops/:id/schedule        # Full task schedule

TASKS
  GET    /api/tasks/today               # Today's tasks
  GET    /api/tasks/upcoming?days=7     # Next 7 days
  PATCH  /api/tasks/:id/complete        # Mark done
  PATCH  /api/tasks/:id/reschedule      # Reschedule

WEATHER
  GET    /api/weather?lat=&lon=         # Current + 5-day forecast

ANALYTICS
  GET    /api/crops/:id/analytics       # Cost, yield, profit data
  GET    /api/crops/:id/export          # PDF report
```

---

## 9. DEVELOPMENT PHASES

### Phase 1 — MVP (4–5 weeks)
- [ ] Auth (Phone OTP)
- [ ] Add Farm + Crop
- [ ] Auto-generate schedule (Chilli + Cotton)
- [ ] Dashboard with today's tasks
- [ ] Mark task as done
- [ ] Push notifications (FCM)
- [ ] Hindi localization

### Phase 2 — Core Features (3–4 weeks)
- [ ] Crop Calendar view
- [ ] Weather widget integration
- [ ] Cost tracking
- [ ] Yield logging
- [ ] Offline-first (WatermelonDB sync)

### Phase 3 — Analytics & Polish (2–3 weeks)
- [ ] Charts (yield, cost)
- [ ] PDF export
- [ ] Marathi + other language support
- [ ] Pest/disease photo guide
- [ ] Google Play submission

---

## 10. FARMER-CENTRIC UX PRINCIPLES

1. **Large tap targets** — minimum 48×48dp buttons (farmers use phones with rough hands)
2. **Icon + Text always** — never icon-only; use crop emoji 🌶️🌿 generously
3. **Voice-friendly** — short sentences, simple Hindi/Marathi
4. **Low-data mode** — compress images, lazy load, cache aggressively
5. **Color coding** — consistent: Red = urgent/pest, Blue = water, Yellow = fertilizer, Green = harvest
6. **No jargon** — "पाणी द्या" not "Schedule irrigation event"
7. **Confirmation on done** — satisfying ✅ animation when task is marked complete

---

## SUMMARY TABLE

| Concern | Choice | Reason |
|---|---|---|
| Mobile | React Native + Expo | Cross-platform, fast dev, OTA updates |
| Offline | WatermelonDB | Rural areas with no internet |
| Backend | Node.js + Express + TypeScript | Your stack, scalable |
| Database | PostgreSQL + Prisma | Relational, type-safe |
| Notifications | FCM + BullMQ | Reliable scheduled push alerts |
| Auth | Phone OTP (SMS) | Farmers don't use email |
| Language | i18next | Hindi/Marathi/Regional |
| Weather | Open-Meteo | Free, accurate Indian data |
| Deploy | Railway + EAS Build | Simple, cheap, internship-friendly |
