# 🌱 Crop Scheduler Mobile App — Tech Stack & Architecture Guide
**Stack: JavaScript + MongoDB | Crops: Chilli & Cotton | Target: Farmers (Rural India)**

---

## 1. TECH STACK

### Frontend — React Native + Expo (JavaScript)
| Layer | Technology | Why |
|---|---|---|
| Framework | **React Native + Expo** | Single codebase Android & iOS; 90% Indian farmers use Android |
| Language | **JavaScript (ES2022)** | No compiler needed, faster dev, your existing strength |
| Navigation | **React Navigation v6** | Industry standard, deep linking support |
| State Management | **Zustand** | Lightweight, no boilerplate |
| UI Library | **React Native Paper** | Material Design 3, accessible, easy to localize |
| Local DB | **AsyncStorage + MMKV** | Offline storage for tasks and crop data |
| Notifications | **Expo Notifications + Firebase FCM** | Push alerts for irrigation, spray, harvest |
| Localization | **i18next + react-i18next** | Hindi, Marathi, Telugu, Gujarati |
| Charts | **Victory Native** | Yield analytics, cost tracking charts |
| Weather API | **Open-Meteo (free)** | Accurate localized Indian weather data |

### Backend — Node.js + Express (JavaScript)
| Layer | Technology | Why |
|---|---|---|
| Runtime | **Node.js + Express.js** | Your existing stack, fast REST API |
| Language | **JavaScript (ES2022)** | No TypeScript compiler, simpler setup |
| ODM | **Mongoose** | MongoDB schema modeling, validation, middleware |
| Database | **MongoDB Atlas** | Free cloud tier, flexible documents, no migrations |
| Cache | **Redis (Upstash free)** | Weather cache, notification queue |
| Job Scheduler | **node-cron** | Daily cron for push notification dispatch |
| Auth | **JWT + jsonwebtoken** | Stateless auth, refresh tokens |
| File Storage | **Cloudinary** | Crop photos, disease images |
| Notifications | **Firebase Admin SDK** | Server-side FCM push dispatch |
| Validation | **Joi** | Request body validation |
| Env Config | **dotenv** | Environment variable management |

### DevOps & Deployment
| Layer | Technology |
|---|---|
| Hosting | **Railway.app / Render** (free tier → production) |
| Database | **MongoDB Atlas** (free 512MB cluster) |
| CI/CD | **GitHub Actions** |
| Monitoring | **Sentry** |
| App Build | **Expo EAS Build** → Google Play Store |

---

## 2. VS CODE SETUP

### Required Extensions
```
React Native Tools          (Microsoft)
Expo Tools                  (Expo)
ES7+ React/Redux Snippets   (dsznajder)
MongoDB for VS Code         (MongoDB)
Mongoose Snippets           (dev-star)
REST Client                 (Huachao Mao)   ← test APIs inside VS Code
ESLint                      (Microsoft)
Prettier                    (Prettier)
DotENV                      (mikestead)
Error Lens                  (usernamehw)
GitLens                     (GitKraken)
Path Intellisense           (Christian Kohler)
```

### VS Code Settings (settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "eslint.validate": ["javascript", "javascriptreact"],
  "files.associations": {
    "*.js": "javascript",
    "*.jsx": "javascriptreact"
  }
}
```

### .eslintrc.js (root)
```js
module.exports = {
  env: { node: true, es2022: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off'
  }
}
```

### .prettierrc (root)
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 3. FOLDER STRUCTURE

### Mobile App
```
crop-scheduler-app/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── OtpScreen.js
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.js
│   │   ├── crop/
│   │   │   ├── AddCropScreen.js
│   │   │   └── CropScheduleScreen.js
│   │   ├── calendar/
│   │   │   └── CalendarScreen.js
│   │   └── analytics/
│   │       └── AnalyticsScreen.js
│   ├── components/
│   │   ├── CropCard.js
│   │   ├── TaskCard.js
│   │   ├── WeatherWidget.js
│   │   └── PestWarningBanner.js
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   └── AuthNavigator.js
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── useCropStore.js
│   │   └── useTaskStore.js
│   ├── services/
│   │   ├── api.js              # Axios base instance
│   │   ├── weatherService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── cropUtils.js        # DAS calculations
│   │   └── dateUtils.js
│   └── i18n/
│       ├── index.js
│       ├── en.json
│       ├── hi.json             # Hindi
│       └── mr.json             # Marathi
├── app.json
├── App.js
├── package.json
└── .env
```

### Backend
```
crop-scheduler-backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── farm.routes.js
│   │   ├── crop.routes.js
│   │   ├── task.routes.js
│   │   ├── weather.routes.js
│   │   └── analytics.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── crop.controller.js
│   │   ├── task.controller.js
│   │   └── analytics.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Farm.js
│   │   ├── Crop.js
│   │   ├── Task.js
│   │   ├── CostLog.js
│   │   └── YieldLog.js
│   ├── services/
│   │   ├── scheduleEngine.js   # Core: auto-generates tasks from sowing date
│   │   ├── weatherService.js
│   │   └── notificationService.js
│   ├── jobs/
│   │   └── dailyNotifier.js    # node-cron daily push job
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── firebase.js         # Firebase Admin init
│   └── app.js
├── server.js
├── package.json
└── .env
```

---

## 4. MONGODB SCHEMAS (Mongoose)

### User.js
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  phone:     { type: String, required: true, unique: true },
  language:  { type: String, default: 'hi', enum: ['hi','mr','en','te','gu'] },
  location:  { type: String },          // District / Taluka
  fcmToken:  { type: String },          // Firebase push token
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### Farm.js
```js
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },   // e.g. "शेत नं. 1"
  area:     { type: Number, required: true },   // acres
  location: { type: String, required: true },   // District/Taluka
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
```

### Crop.js
```js
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, required: true, enum: ['CHILLI', 'COTTON'] },
  variety:    { type: String },          // e.g. "LCA 334", "Bt Cotton"
  sowingDate: { type: Date, required: true },
  status:     { type: String, default: 'ACTIVE', enum: ['ACTIVE','HARVESTED','FAILED'] },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
```

### Task.js
```js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  cropId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String, required: true,
    enum: ['NURSERY','TRANSPLANTING','IRRIGATION','FERTILIZER','PEST','HARVEST']
  },
  title:       { type: String, required: true },
  description: { type: String },
  dueDate:     { type: Date, required: true },
  dasDay:      { type: Number },          // Days After Sowing offset
  isDone:      { type: Boolean, default: false },
  priority:    { type: String, default: 'MEDIUM', enum: ['HIGH','MEDIUM','LOW'] },
  notified:    { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast "today's tasks" queries
taskSchema.index({ userId: 1, dueDate: 1, isDone: 1 });

module.exports = mongoose.model('Task', taskSchema);
```

### CostLog.js
```js
const mongoose = require('mongoose');

const costLogSchema = new mongoose.Schema({
  cropId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  category: { type: String, required: true },  // Fertilizer, Pesticide, Labour, Water
  amount:   { type: Number, required: true },
  date:     { type: Date, default: Date.now },
  notes:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CostLog', costLogSchema);
```

### YieldLog.js
```js
const mongoose = require('mongoose');

const yieldLogSchema = new mongoose.Schema({
  cropId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  weight:  { type: Number, required: true },   // kg
  date:    { type: Date, default: Date.now },
  picking: { type: Number, required: true },   // 1, 2, 3...
  notes:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('YieldLog', yieldLogSchema);
```

---

## 5. SCHEDULE ENGINE (Core Logic)

```js
// src/services/scheduleEngine.js
const { addDays } = require('date-fns');

const CHILLI_SCHEDULE = [
  { das: 0,   category: 'NURSERY',       title: 'Seed Treatment',                     priority: 'HIGH'   },
  { das: 7,   category: 'NURSERY',       title: 'Nursery Sowing',                     priority: 'HIGH'   },
  { das: 35,  category: 'TRANSPLANTING', title: 'Transplanting Alert',                priority: 'HIGH'   },
  { das: 36,  category: 'IRRIGATION',    title: 'First Irrigation after Transplant',  priority: 'HIGH'   },
  { das: 40,  category: 'FERTILIZER',    title: 'Basal Dose Application',             priority: 'HIGH'   },
  { das: 60,  category: 'PEST',          title: 'Thrips Monitoring',                  priority: 'MEDIUM' },
  { das: 75,  category: 'FERTILIZER',    title: 'Nitrogen Top Dressing',              priority: 'MEDIUM' },
  { das: 90,  category: 'PEST',          title: 'Fruit Borer Scouting',               priority: 'HIGH'   },
  { das: 100, category: 'IRRIGATION',    title: 'Fruit Development Watering',         priority: 'HIGH'   },
  { das: 110, category: 'FERTILIZER',    title: 'Micronutrient Spray',                priority: 'MEDIUM' },
  { das: 120, category: 'HARVEST',       title: 'First Picking',                      priority: 'HIGH'   },
  { das: 135, category: 'HARVEST',       title: 'Second Picking',                     priority: 'MEDIUM' },
];

const COTTON_SCHEDULE = [
  { das: -10, category: 'NURSERY',    title: 'Soil Testing',                  priority: 'MEDIUM' },
  { das: 0,   category: 'NURSERY',    title: 'Seed Treatment & Sowing',       priority: 'HIGH'   },
  { das: 10,  category: 'NURSERY',    title: 'Germination Check',             priority: 'MEDIUM' },
  { das: 20,  category: 'FERTILIZER', title: 'Basal Fertilizer Application',  priority: 'HIGH'   },
  { das: 35,  category: 'IRRIGATION', title: 'Vegetative Stage Irrigation',   priority: 'HIGH'   },
  { das: 45,  category: 'FERTILIZER', title: 'Nitrogen Split Dose 1',         priority: 'HIGH'   },
  { das: 60,  category: 'PEST',       title: 'Whitefly Monitoring',           priority: 'HIGH'   },
  { das: 65,  category: 'PEST',       title: 'Pink Bollworm Alert',           priority: 'HIGH'   },
  { das: 80,  category: 'FERTILIZER', title: 'Potash Application',            priority: 'MEDIUM' },
  { das: 90,  category: 'IRRIGATION', title: 'Boll Development Irrigation',   priority: 'HIGH'   },
  { das: 100, category: 'PEST',       title: 'Aphid & Jassid Scouting',       priority: 'MEDIUM' },
  { das: 150, category: 'HARVEST',    title: 'Harvest Readiness Prediction',  priority: 'HIGH'   },
  { das: 160, category: 'HARVEST',    title: 'First Picking',                 priority: 'HIGH'   },
];

function generateSchedule(cropType, sowingDate, cropId, userId) {
  const template = cropType === 'CHILLI' ? CHILLI_SCHEDULE : COTTON_SCHEDULE;
  return template.map(task => ({
    cropId,
    userId,
    category:    task.category,
    title:       task.title,
    priority:    task.priority,
    dasDay:      task.das,
    dueDate:     addDays(new Date(sowingDate), task.das),
    isDone:      false,
    notified:    false,
  }));
}

module.exports = { generateSchedule };
```

---

## 6. BACKEND DEPENDENCIES (package.json)

```json
{
  "name": "crop-scheduler-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start":  "node server.js",
    "dev":    "nodemon server.js",
    "lint":   "eslint src/"
  },
  "dependencies": {
    "express":             "^4.18.2",
    "mongoose":            "^8.3.0",
    "jsonwebtoken":        "^9.0.2",
    "bcryptjs":            "^2.4.3",
    "dotenv":              "^16.4.5",
    "cors":                "^2.8.5",
    "helmet":              "^7.1.0",
    "joi":                 "^17.12.3",
    "date-fns":            "^3.6.0",
    "node-cron":           "^3.0.3",
    "firebase-admin":      "^12.1.0",
    "axios":               "^1.6.8",
    "cloudinary":          "^2.2.0",
    "express-rate-limit":  "^7.2.0",
    "morgan":              "^1.10.0"
  },
  "devDependencies": {
    "nodemon":  "^3.1.0",
    "eslint":   "^8.57.0"
  }
}
```

### Install Command
```bash
cd crop-scheduler-backend
npm install
```

---

## 7. MOBILE APP DEPENDENCIES (package.json)

```json
{
  "name": "crop-scheduler-app",
  "version": "1.0.0",
  "main": "App.js",
  "scripts": {
    "start":    "expo start",
    "android":  "expo start --android",
    "ios":      "expo start --ios",
    "lint":     "eslint src/"
  },
  "dependencies": {
    "expo":                               "~51.0.0",
    "expo-status-bar":                    "~1.12.1",
    "expo-notifications":                 "~0.28.0",
    "expo-device":                        "~6.0.2",
    "expo-constants":                     "~16.0.2",
    "react":                              "18.2.0",
    "react-native":                       "0.74.1",
    "@react-navigation/native":           "^6.1.17",
    "@react-navigation/bottom-tabs":      "^6.5.20",
    "@react-navigation/native-stack":     "^6.9.26",
    "react-native-screens":               "^3.31.1",
    "react-native-safe-area-context":     "^4.10.1",
    "react-native-paper":                 "^5.12.3",
    "react-native-vector-icons":          "^10.1.0",
    "zustand":                            "^4.5.2",
    "axios":                              "^1.6.8",
    "@react-native-async-storage/async-storage": "^1.23.1",
    "react-native-mmkv":                  "^2.12.2",
    "i18next":                            "^23.11.2",
    "react-i18next":                      "^14.1.1",
    "victory-native":                     "^41.1.0",
    "react-native-calendars":             "^1.1305.0",
    "date-fns":                           "^3.6.0",
    "react-native-gesture-handler":       "^2.16.2",
    "react-native-reanimated":            "^3.11.0"
  },
  "devDependencies": {
    "@babel/core":  "^7.24.0",
    "eslint":       "^8.57.0"
  }
}
```

### Install Command
```bash
cd crop-scheduler-app
npm install
npx expo install     # fixes Expo-compatible versions automatically
```

---

## 8. ENVIRONMENT VARIABLES

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cropscheduler

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=7d

# Firebase Admin (download from Firebase Console)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Weather (Open-Meteo is free, no key needed)
WEATHER_BASE_URL=https://api.open-meteo.com/v1
```

### Mobile App (.env)
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:5000/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
```

---

## 9. MONGODB ATLAS SETUP (Step-by-Step)

```
1. Go to https://cloud.mongodb.com → Create free account
2. Create a FREE cluster (M0 — 512MB, free forever)
3. Database Access → Add Database User
   Username: cropapp_user
   Password: <strong password>
   Role: readWriteAnyDatabase
4. Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)
5. Connect → Connect your application → Copy connection string
6. Replace <password> in the string and paste into MONGO_URI in .env
```

---

## 10. DATABASE CONNECTION (config/db.js)

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'cropscheduler',
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 11. SERVER ENTRY POINT (server.js)

```js
require('dotenv').config();
const app      = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
```

---

## 12. EXPRESS APP (src/app.js)

```js
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');

const authRoutes      = require('./routes/auth.routes');
const farmRoutes      = require('./routes/farm.routes');
const cropRoutes      = require('./routes/crop.routes');
const taskRoutes      = require('./routes/task.routes');
const weatherRoutes   = require('./routes/weather.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler    = require('./middleware/errorHandler');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/farms',     farmRoutes);
app.use('/api/crops',     cropRoutes);
app.use('/api/tasks',     taskRoutes);
app.use('/api/weather',   weatherRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

---

## 13. API ENDPOINTS

```
AUTH
  POST   /api/auth/send-otp              Send OTP to farmer's phone
  POST   /api/auth/verify-otp            Verify OTP → return JWT

FARMS
  GET    /api/farms                      All farms for logged-in user
  POST   /api/farms                      Add a new farm

CROPS
  POST   /api/crops                      Add crop → auto-generates full task schedule
  GET    /api/crops/:id/schedule         Full task list for a crop

TASKS
  GET    /api/tasks/today                Today's tasks (high priority first)
  GET    /api/tasks/upcoming?days=7      Next N days tasks
  PATCH  /api/tasks/:id/complete         Mark task as done
  PATCH  /api/tasks/:id/reschedule       Reschedule to new date

WEATHER
  GET    /api/weather?lat=&lon=          Current forecast + 5-day

ANALYTICS
  GET    /api/analytics/:cropId          Cost breakdown + yield data
  GET    /api/analytics/:cropId/export   PDF report download
```

---

## 14. DAILY NOTIFICATION JOB (jobs/dailyNotifier.js)

```js
const cron     = require('node-cron');
const Task     = require('../models/Task');
const User     = require('../models/User');
const admin    = require('../config/firebase');

// Runs every day at 7:00 AM IST
cron.schedule('30 1 * * *', async () => {   // 01:30 UTC = 07:00 IST
  console.log('📲 Running daily notification job...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueTasks = await Task.find({
    dueDate: { $gte: today, $lt: tomorrow },
    isDone: false,
    notified: false,
  }).populate('userId', 'fcmToken name language');

  for (const task of dueTasks) {
    const user = task.userId;
    if (!user?.fcmToken) continue;

    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: '🌱 Crop Alert',
        body:  task.title,
      },
      data: { taskId: task._id.toString() },
    });

    await Task.findByIdAndUpdate(task._id, { notified: true });
  }

  console.log(`✅ Sent ${dueTasks.length} notifications`);
}, { timezone: 'Asia/Kolkata' });
```

---

## 15. DEVELOPMENT PHASES

### Phase 1 — MVP (4–5 weeks)
- [ ] MongoDB Atlas cluster setup
- [ ] Phone OTP authentication (JWT)
- [ ] Add Farm + Add Crop screens
- [ ] Schedule Engine → auto-generate tasks on crop creation
- [ ] Dashboard screen with today's tasks
- [ ] Mark task as done
- [ ] Firebase FCM push notifications
- [ ] Hindi localization (i18next)

### Phase 2 — Core Features (3–4 weeks)
- [ ] Crop Calendar view (react-native-calendars)
- [ ] Weather widget (Open-Meteo API)
- [ ] Cost logging per task
- [ ] Yield logging per picking
- [ ] Offline support (AsyncStorage + MMKV)
- [ ] Marathi language support

### Phase 3 — Analytics & Launch (2–3 weeks)
- [ ] Charts — yield and cost (Victory Native)
- [ ] PDF export (for bank/insurance)
- [ ] Telugu + Gujarati support
- [ ] Pest & disease photo guide
- [ ] Google Play Store submission (Expo EAS Build)

---

## 16. FARMER-CENTRIC UX RULES

| Rule | Detail |
|---|---|
| Large tap targets | Minimum 48×48dp — farmers work with rough hands |
| Icon + Text always | Never icon-only buttons; use emoji 🌶️🌿 generously |
| Simple language | "पाणी द्या" not "Schedule irrigation event" |
| Low-data mode | Compress images, cache weather for 6 hours |
| Color coding | 🔴 Pest, 🔵 Irrigation, 🟡 Fertilizer, 🟢 Harvest — consistent everywhere |
| OTP only | No email login — farmers use phone numbers only |
| Done animation | Satisfying ✅ tick when task is marked complete |
| Offline banner | Always show "Offline Mode" when no internet |
| Regional language first | Language picker on very first launch |

---

## SUMMARY

| Concern | Choice | Reason |
|---|---|---|
| Language | JavaScript (ES2022) | No compiler, faster dev, your strength |
| Mobile | React Native + Expo | Cross-platform, OTA updates |
| Backend | Node.js + Express | Your existing stack |
| Database | MongoDB + Mongoose | Flexible documents, free Atlas tier |
| Offline | AsyncStorage + MMKV | Lightweight on-device storage |
| Notifications | FCM + node-cron | Reliable daily push dispatch |
| Auth | Phone OTP + JWT | Farmers don't use email |
| Localization | i18next | Hindi, Marathi, Regional |
| Weather | Open-Meteo | Free, no API key needed |
| Deploy | Railway + EAS Build | Simple, internship-friendly |
