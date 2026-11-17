# Chow — Food Delivery Platform

**Chow** is a South African food-delivery platform designed to connect customers, restaurants, and independent delivery drivers through one integrated marketplace.

The platform is being developed to simplify food ordering, restaurant operations, and delivery management while creating opportunities for local restaurants and independent drivers.

## Project Status

Chow is currently in its development and proof-of-concept stage. The core platform workflows have been implemented, and the application is deployed for testing.

The current focus is improving the user experience, validating end-to-end workflows, onboarding test restaurants and drivers, and preparing the platform for future payment-gateway integration.

## Key Features

### Customer Experience
- Customer registration, login, and email verification.
- Browse available restaurants and explore their menus.
- Add items to a shopping cart and place orders.
- Delivery address suggestions and autocomplete.
- View ongoing orders and previous order history separately.
- Track delivery progress and assigned drivers.
- Receive order notifications.
- Communicate through order-specific chat.
- Confirm delivery using a six-digit delivery PIN.

### Restaurant Management
- Restaurant-specific dashboards.
- Restaurant and menu management.
- View incoming customer orders.
- Accept and manage orders through the preparation process.
- Update order statuses and manage restaurant operations.

### Driver Management
- Dedicated driver dashboard.
- View and manage assigned deliveries.
- Access customer delivery information.
- Track delivery progress.
- Verify delivery using the customer's delivery PIN.

### Administration
- Role-based access control.
- Administrative account management.
- Manage demonstration accounts.
- View financial summaries and platform activity.
- Review customer-reported order issues.
- Support for controlled demonstration environments.

### Platform Features
- Responsive frontend with a consistent design system.
- Centralised navigation and role-specific dashboards.
- Order lifecycle management.
- Automated email verification using Brevo.
- Notifications and order-specific communication.
- Delivery-distance calculations.
- Delivery address autocomplete using Geoapify.

## Order Lifecycle

Orders follow a structured workflow:

`PENDING → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED`

The platform manages order progression between customers, restaurants, and drivers, with delivery confirmation handled through PIN verification.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Java 21, Spring Boot |
| Security | Spring Security, JWT |
| Database | PostgreSQL |
| Email | Brevo |
| Address Services | Geoapify |
| Deployment | Render |
| Database Hosting | Supabase |
| Version Control | Git, GitHub |

## Architecture

Chow follows a frontend/backend architecture.

- **Frontend:** Handles the customer-facing experience, restaurant dashboards, driver dashboards, and administrative interfaces.
- **Backend:** Provides REST APIs, authentication, business logic, order management, and platform operations.
- **Database:** Stores users, restaurants, menu items, orders, and related platform records.
- **External Services:** Brevo supports transactional email, while Geoapify supports delivery-address suggestions.

## Repository Structure

```text
food-delivery-platform/
│
├── backend/
│   └── backend/
│       └── src/
│           └── main/
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── cart/
│   │   ├── login/
│   │   ├── orders/
│   │   ├── notifications/
│   │   ├── restaurants/
│   │   ├── restaurant-dashboard/
│   │   └── driver-dashboard/
│   │
│   └── lib/
│
└── README.md
```

## Local Development

### Prerequisites

- Node.js and npm
- Java 21
- Maven
- PostgreSQL

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally at:

`http://localhost:3000`

Configure the frontend API endpoint using:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Geoapify configuration can be supplied through:

```env
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_api_key
```

### Backend

```bash
cd backend/backend
mvn spring-boot:run
```

Configure the PostgreSQL connection and required application secrets through the backend environment or application configuration.

## Payments

The platform currently supports payment-status management and test-payment functionality for development and demonstration purposes.

Supported payment states include:

- PENDING
- PROCESSING
- PAID
- FAILED

Integration with a production payment gateway remains part of the development roadmap.

## Development Roadmap

- [x] Core customer, restaurant, and driver workflows.
- [x] Authentication and role-based access control.
- [x] Restaurant menus and order management.
- [x] Delivery-distance calculations.
- [x] Email verification.
- [x] Order notifications and customer-driver communication.
- [x] Delivery PIN verification.
- [x] Administrative account management.
- [x] Responsive frontend and visual redesign.
- [ ] Production payment-gateway integration.
- [ ] Expanded restaurant and driver onboarding.
- [ ] Further end-to-end testing and production readiness.
- [ ] Continued optimisation of the customer and delivery experience.

## Project Vision

Chow aims to become a locally relevant food-delivery marketplace that makes ordering more accessible for customers while helping independent restaurants reach more people and creating flexible opportunities for delivery drivers.

The long-term vision is to develop Chow beyond a website into a fully featured mobile application supported by a scalable technology platform.

## Repository

**GitHub:** https://github.com/Khazimla-Majavu/food-delivery-platform
