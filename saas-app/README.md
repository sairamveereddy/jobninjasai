# JobNinjas - SaaS Application

A full-stack SaaS application for human-powered job application services with role-based dashboards.

## 🏗️ Architecture

- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk (multi-role support)
- **Database**: PostgreSQL
- **Payments**: Paddle
- **UI**: Tailwind CSS + shadcn/ui
- **Port**: 3001 (separate from landing page on 3000)

## 📁 Project Structure

```
/app/saas-app/
├── app/
│   ├── (public)/          # Public routes (no auth)
│   │   ├── page.tsx       # Landing
│   │   ├── pricing/
│   │   ├── login/
│   │   ├── signup/
│   │   └── book-call/
│   ├── (customer)/        # Customer dashboard
│   │   ├── dashboard/
│   │   ├── billing/
│   │   └── settings/
│   ├── (employee)/        # Employee portal
│   │   └── employee/
│   │       ├── page.tsx
│   │       └── case/[caseId]/
│   ├── (admin)/           # Admin console
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── customers/
│   │       ├── employees/
│   │       └── billing/
│   └── api/
│       ├── webhooks/paddle/
│       └── checkout/
├── components/
│   ├── ui/                # shadcn components
│   ├── dashboard/         # Dashboard components
│   ├── customer/          # Customer-specific
│   ├── employee/          # Employee-specific
│   └── admin/             # Admin-specific
├── lib/
│   ├── db/                # Database utilities
│   ├── auth.ts            # Auth helpers
│   └── utils.ts
└── middleware.ts          # Route protection

```

## 🗄️ Database Schema

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  role VARCHAR CHECK (role IN ('customer', 'employee', 'admin')),
  resume_url VARCHAR,
  linkedin_url VARCHAR,
  preferences_json JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

### Plans
```sql
CREATE TABLE plans (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  price_monthly INTEGER NOT NULL,
  apps_per_day INTEGER NOT NULL,
  features_json JSONB
);
```

### Subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id VARCHAR REFERENCES plans(id),
  status VARCHAR CHECK (status IN ('active', 'past_due', 'canceled')),
  provider VARCHAR DEFAULT 'paddle',
  provider_customer_id VARCHAR,
  provider_subscription_id VARCHAR,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Cases
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  assigned_employee_id UUID REFERENCES users(id),
  stage VARCHAR CHECK (stage IN ('active', 'paused', 'completed')),
  target_roles TEXT[],
  target_locations TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Applications
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES cases(id),
  employee_id UUID REFERENCES users(id),
  company_name VARCHAR NOT NULL,
  job_title VARCHAR NOT NULL,
  jd_text TEXT,
  application_link VARCHAR,
  status VARCHAR CHECK (status IN ('found', 'prepared', 'submitted', 'rejected')),
  submitted_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Audit Events
```sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /app/saas-app
yarn install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
# Fill in Clerk, Paddle, and Database credentials
```

### 3. Run Development Server
```bash
yarn dev
# App runs on http://localhost:3001
```

## 🔐 Authentication & Routing

### Role-Based Redirects (after login)
- **Customer** → `/dashboard`
- **Employee** → `/employee`
- **Admin** → `/admin`

### Middleware Protection
All routes under `(customer)`, `(employee)`, and `(admin)` are protected by Clerk middleware and role-checked.

## 💳 Payment Integration (Paddle)

### Checkout Flow
1. Customer selects plan on `/pricing`
2. POST to `/api/create-checkout-session` with `planId`
3. Redirect to Paddle checkout
4. Paddle webhook hits `/api/webhooks/paddle`
5. Create subscription + case in database
6. Send welcome email

### Webhook Events
- `subscription.created` → Activate subscription, create case
- `subscription.updated` → Update status (active/past_due)
- `subscription.canceled` → Mark as canceled, pause case

## 📊 Features

### Customer Dashboard
- **KPIs**: Apps prepared, apps submitted, outreach, interviews, hours saved
- **Pipeline Table**: All applications with filters
- **Approve Queue**: Review prepared applications before submission
- **Weekly Summary**: Timeline view of activity
- **Messaging**: Contact assigned specialist

### Employee Portal
- **Case List**: All assigned customers
- **Case Detail**: Customer profile, preferences, activity log
- **Add Application**: Form to log new job applications
- **Metrics**: Personal output tracking

### Admin Console
- **Overview**: System-wide KPIs
- **Customer Management**: Assign/reassign employees
- **Employee Metrics**: Capacity and output tracking
- **Billing Dashboard**: Failed payments, subscription health
- **Notifications**: New customers, payment issues, milestones

## 🎨 Design System

Following HustleHive's premium SaaS aesthetic:
- Clean, minimal layouts with ample whitespace
- Rounded cards with subtle shadows
- Strong typography hierarchy
- Green accent color (brand)
- Responsive, mobile-first design
- **Human-first** language throughout

## 📝 Current Status

✅ **Completed**:
- Project structure
- Base UI components (Button, Card, Badge)
- Mock data layer
- Home page
- Type definitions

🚧 **In Progress**:
- Customer dashboard
- Employee portal
- Admin console

⏳ **TODO**:
- Clerk auth integration
- Database setup
- Paddle checkout & webhooks
- Email notifications
- Testing

## 🛠️ Development Notes

### Mock Data First
All dashboards are built with mock data from `/lib/mockData.ts`. Real database integration comes after UI approval.

### Component Structure
- Keep components under 300 lines
- Use TypeScript for type safety
- Follow shadcn/ui patterns
- Mobile-responsive by default

### Code Quality
- ESLint configured
- TypeScript strict mode
- Consistent naming conventions
- Clear comments for TODO items

## 📚 Documentation

- [Clerk Docs](https://clerk.com/docs)
- [Paddle Docs](https://developer.paddle.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)

---

**jobNinjas** - Apply Smarter, Land Faster - AI Resume Tools & Human Job Application Service
