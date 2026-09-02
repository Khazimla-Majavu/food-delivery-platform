# FoodDelivery Platform

A full-stack South African food delivery platform inspired by services such as Uber Eats. The platform connects **customers, restaurants, and drivers** through a web application and REST API.

The project is being developed as an MVP with the goal of eventually supporting restaurant ordering, delivery dispatch, payments, location services, driver communication, and a scalable business model.

---

## Project Status

**Current stage:** MVP development — Core ordering and delivery lifecycle working

The following core functionality has been implemented and browser-tested:

- Customer authentication
- Restaurant authentication
- Driver authentication
- JWT-based authentication
- Role-based access
- Restaurant discovery
- Restaurant menu viewing
- Shopping cart
- Order creation
- Restaurant order management
- Driver delivery management
- Complete order lifecycle
- Customer order history
- Restaurant menu management
- Global authentication/navigation system

The complete order lifecycle has been successfully tested from customer order creation through restaurant preparation, driver pickup, and delivery completion.

---

# 1. Product Overview

FoodDelivery is designed as a South African food delivery marketplace with three primary users:

### Customer

Customers can:

- Register an account
- Log in
- Browse restaurants
- View restaurant menus
- Add menu items to their cart
- Adjust quantities
- Remove items
- Place orders
- View previous orders
- Track the status of their orders

### Restaurant

Restaurants can:

- Register/login
- Access their restaurant dashboard
- Manage menu items
- Add menu items
- Edit menu items
- Delete menu items
- View incoming orders
- Accept orders
- Start preparing orders
- Mark orders as ready
- Cancel orders where applicable

### Driver

Drivers can:

- Register/login
- Access the driver dashboard
- View available deliveries
- Claim available deliveries
- View their deliveries
- Complete deliveries

---

# 2. Business Model

The intended business model uses multiple revenue streams.

## Restaurant Commission

Restaurants pay a percentage commission on completed orders.

The platform aims to eventually offer restaurants a competitive commission rate while maintaining enough margin to operate profitably.

## Customer Delivery Fee

Customers pay a delivery fee when placing an order.

The eventual delivery fee can be calculated based on factors such as:

- Distance
- Restaurant location
- Customer location
- Demand
- Delivery conditions

## Driver Commission

The current business concept uses a **capped driver commission model** rather than a fixed monthly fee.

The idea is to avoid creating an upfront financial barrier for drivers.

An example model being considered is:

> Driver contributes approximately 15% of delivery earnings toward a predetermined cap.

Once the driver's contribution reaches the cap, additional deliveries would not incur the same platform charge during that period.

The exact commercial model has not yet been finalized.

---

# 3. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

Current frontend version:

- Next.js 16.3.1
- Node.js 24.19.0
- npm 11.17.0

## Backend

- Java
- Spring Boot
- Spring Security
- JWT authentication
- REST API
- BCrypt password hashing

Current Java version:

- Java 21.0.5

Current Spring Boot version:

- Spring Boot 4.1.0

## Database

- PostgreSQL

Current PostgreSQL version:

- PostgreSQL 18.6

Database:

```text
food_delivery
```

## Development Tools

- Git
- GitHub
- Maven
- npm
- VS Code / code editor
- Browser developer tools
- Postman / browser testing where required

---

# 4. Repository

GitHub repository:

```text
Khazimla-Majavu/food-delivery-platform
```

Main branch:

```text
main
```

Local project directory:

```text
~/Food_Delivery_Platform/food-delivery-platform
```

---

# 5. Project Structure

The project is organized into separate frontend and backend applications.

```text
food-delivery-platform/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── ...
│   │   │   └── resources/
│   │   │       └── ...
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── app/
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── CartContext.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RestaurantList.tsx
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.tsx
│   │   │
│   │   ├── driver-dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── restaurant-dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── restaurants/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   │
│   ├── package.json
│   ├── next.config.ts
│   └── ...
│
└── README.md
```

> The exact backend package structure may evolve as development continues.

---

# 6. Frontend Pages

The frontend currently contains the following routes.

| Route                   | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `/`                     | Customer homepage / restaurant discovery |
| `/login`                | Login                                    |
| `/register`             | Account registration                     |
| `/cart`                 | Shopping cart and order checkout         |
| `/orders`               | Customer order history                   |
| `/restaurants/[id]`     | Restaurant menu                          |
| `/restaurant-dashboard` | Restaurant management                    |
| `/driver-dashboard`     | Driver delivery management               |

---

# 7. Authentication

Authentication uses JWT tokens.

After successful login, the frontend stores:

```text
token
user
```

in `localStorage`.

The stored user information contains details such as:

- ID
- Name
- Email
- Phone
- Role

Supported roles currently include:

```text
CUSTOMER
RESTAURANT
DRIVER
ADMIN
```

The authentication helper is located at:

```text
frontend/lib/auth.ts
```

It provides:

- `getToken()`
- `getUser()`
- `logout()`

---

# 8. Global Navigation

The project originally had separate navigation bars on several pages.

This was cleaned up so that the application now uses a **single global Navbar**.

The global navigation is implemented in:

```text
frontend/app/components/Navbar.tsx
```

and included globally through:

```text
frontend/app/layout.tsx
```

The Navbar changes according to the logged-in user's role.

### Customer

```text
FoodDelivery
Hi, [Name]
My Orders
Cart
Log out
```

### Restaurant

```text
FoodDelivery
Hi, [Name]
Restaurant Dashboard
Log out
```

### Driver

```text
FoodDelivery
Hi, [Name]
Driver Dashboard
Log out
```

### Logged out

```text
FoodDelivery
Log in
Register
```

This removed duplicated navigation from:

- Homepage
- Login
- Restaurant Dashboard
- Driver Dashboard
- Cart

---

# 9. Customer Ordering Flow

The customer ordering process currently works as follows:

```text
Homepage
   ↓
Browse restaurants
   ↓
Select restaurant
   ↓
View menu
   ↓
Add menu item to cart
   ↓
Cart
   ↓
Proceed to checkout
   ↓
Create order
   ↓
Restaurant receives order
```

The cart is managed using React context.

The cart implementation is located at:

```text
frontend/app/context/CartContext.tsx
```

The cart supports:

- Adding items
- Removing items
- Increasing quantity
- Decreasing quantity
- Calculating totals
- Clearing the cart

The cart currently prevents checkout when items belong to multiple restaurants.

---

# 10. Order Lifecycle

The core order lifecycle is one of the most important completed features.

The current lifecycle is:

```text
PENDING
   ↓
ACCEPTED
   ↓
PREPARING
   ↓
READY
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

Orders can also be:

```text
CANCELLED
```

where applicable.

---

# 11. Restaurant Order Management

Restaurant users have access to:

```text
Restaurant Dashboard
```

The dashboard provides:

### Orders

Restaurants can view orders belonging to their restaurant.

Available actions include:

```text
PENDING
   → Accept Order
   → Cancel Order

ACCEPTED
   → Start Preparing
   → Cancel Order

PREPARING
   → Mark Ready
   → Cancel Order

READY
   → Ready for driver pickup

OUT_FOR_DELIVERY
   → Order is out for delivery

DELIVERED
   → Order delivered

CANCELLED
   → Order cancelled
```

---

# 12. Restaurant Menu Management

Restaurants can manage their menus from the dashboard.

Current functionality:

- View menu
- Add menu item
- Edit menu item
- Delete menu item

Menu items currently contain information such as:

- Name
- Description
- Price
- Restaurant ID

The frontend communicates with the backend through REST endpoints.

---

# 13. Driver Delivery System

Drivers have a dedicated:

```text
Driver Dashboard
```

The dashboard is split into:

### Available Deliveries

Orders that are ready for driver pickup.

### My Deliveries

Orders currently assigned to the logged-in driver.

Drivers can:

```text
Available Order
      ↓
Claim Order
      ↓
My Deliveries
      ↓
Complete Delivery
      ↓
DELIVERED
```

Restaurant information is displayed to the driver, including:

- Restaurant name
- Restaurant address
- Order items
- Order total
- Order status

---

# 14. Core Order Lifecycle Testing

The complete order lifecycle has already been successfully browser-tested.

Test Order:

```text
Order #7
```

Restaurant:

```text
Test Restaurant
Cape Town
```

Item:

```text
Test Burger × 1
```

Total:

```text
R75
```

The order successfully went through:

```text
PENDING
↓
ACCEPTED
↓
PREPARING
↓
READY
↓
Driver claimed order
↓
Driver's My Deliveries
↓
Complete Delivery
↓
DELIVERED
```

This confirms that the three major platform roles can interact with the same order successfully.

---

# 15. REST API

The frontend communicates with the Spring Boot backend through REST endpoints.

Current API base URL during development:

```text
http://localhost:8080
```

The frontend API functions are centralized in:

```text
frontend/lib/api.ts
```

---

## Authentication API

Examples include:

```text
POST /api/auth/login
POST /api/auth/register
```

---

## Restaurant API

Examples include:

```text
GET /api/restaurants
GET /api/restaurants/{id}/menu
```

Restaurant-specific functionality includes retrieving restaurants belonging to the logged-in restaurant account.

---

## Order API

Current order functionality includes:

```text
POST /api/orders/restaurant/{restaurantId}

GET /api/orders/mine

GET /api/orders/restaurant/{restaurantId}

PUT /api/orders/{orderId}/status?status={status}

GET /api/orders/driver/available

POST /api/orders/{orderId}/claim

GET /api/orders/driver/mine

POST /api/orders/{orderId}/complete
```

---

## Menu API

Restaurant menu management includes:

```text
POST
PUT
DELETE
```

operations for menu items.

---

# 16. Security

The backend uses:

- Spring Security
- JWT authentication
- BCrypt password hashing
- Stateless authentication
- Role-based authorization
- JWT request filtering
- CORS configuration

The frontend stores authentication information locally during development.

Security will require additional hardening before production deployment.

---

# 17. Database

The application uses PostgreSQL.

Development database:

```text
food_delivery
```

The database stores information required for:

- Users
- Restaurants
- Menu items
- Orders
- Order items
- Driver assignments
- Other platform entities

The database structure will continue to evolve as additional features are introduced.

---

# 18. Current Frontend API Types

`frontend/lib/api.ts` currently defines types/interfaces including:

```text
Restaurant
MenuItem
UserResponse
LoginResponse
OrderItemRequest
OrderItemResponse
OrderResponse
MenuItemRequest
```

This provides typed communication between the frontend and backend.

---

# 19. Current Development Workflow

Development is being performed incrementally.

The preferred workflow is:

```text
1. Identify one feature/change
        ↓
2. Inspect the existing code
        ↓
3. Make one focused change
        ↓
4. Run the build
        ↓
5. Browser-test the feature
        ↓
6. Confirm the feature works
        ↓
7. Git checkpoint
        ↓
8. Move to the next feature
```

This avoids making many unrelated changes at once and makes it easier to identify problems.

---

# 20. Build Testing

The frontend is currently built using:

```bash
npm run build
```

The latest build completed successfully.

Current Next.js build result:

```text
✓ Compiled successfully
✓ TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

Current routes successfully generated include:

```text
/
 /_not-found
/cart
/driver-dashboard
/login
/orders
/register
/restaurant-dashboard
/restaurants/[id]
```

---

# 21. Git Workflow

Changes are committed after individual milestones rather than waiting until the entire project is finished.

Typical checkpoint:

```bash
git status
git add <files>
git commit -m "Description of change"
git push origin main
git status
```

The final `git status` should show:

```text
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

---

# 22. Recent Git History

Important recent commits include:

```text
a6e3eea
Improve authentication navigation
```

```text
359ae15
Remove duplicate restaurant dashboard navigation
```

```text
34509e2
Remove duplicate driver dashboard navigation
```

```text
adb30aa
Remove duplicate cart navigation
```

The current `main` branch is pushed to GitHub and the working tree is clean.

---

# 23. Completed Milestones

## Milestone 1 — Backend Foundation

Completed:

- Spring Boot backend
- PostgreSQL connection
- User system
- Authentication
- JWT
- Spring Security
- Restaurant system
- Menu system
- Order system
- Driver functionality
- REST APIs

---

## Milestone 2 — Authentication

Completed:

- Login
- Registration
- JWT storage
- User information storage
- Role detection
- Logout
- Authentication-aware navigation

---

## Milestone 3 — Customer Ordering

Completed:

- Restaurant listing
- Restaurant menu
- Cart
- Quantity management
- Item removal
- Cart total
- Order creation

---

## Milestone 4 — Restaurant Management

Completed:

- Restaurant dashboard
- Restaurant identification
- Menu management
- Incoming orders
- Order status management

---

## Milestone 5 — Driver Management

Completed:

- Driver dashboard
- Available deliveries
- Claim order
- My deliveries
- Complete delivery
- Delivery status

---

## Milestone 6 — Complete Order Lifecycle

Completed and browser-tested:

```text
Customer
   ↓
Create Order
   ↓
Restaurant
   ↓
Accept
   ↓
Prepare
   ↓
Ready
   ↓
Driver
   ↓
Claim
   ↓
Deliver
   ↓
DELIVERED
```

---

## Milestone 7 — Navigation Cleanup

Completed:

- Global Navbar
- Removed duplicate homepage navigation
- Removed duplicate login navigation
- Removed duplicate restaurant dashboard navigation
- Removed duplicate driver dashboard navigation
- Removed duplicate cart navigation

---

# 24. What Is Still Outstanding

The platform is functional, but it is still an MVP.

The following major areas remain.

## Customer Experience

Still to improve:

- Better restaurant browsing
- Restaurant search
- Restaurant filtering
- Better menu UI
- Restaurant details
- Customer profile
- Better checkout experience
- Delivery address
- Delivery fee
- Order status tracking
- Better order history
- Order details page
- Order cancellation rules

---

## Restaurant Experience

Still to improve:

- Restaurant profile management
- Restaurant opening/closing status
- Restaurant availability
- Better order-management interface
- Order notifications
- Order preparation estimates
- Restaurant analytics
- Sales reporting
- Restaurant settings

---

## Driver Experience

Still to improve:

- Driver profile
- Driver availability/online status
- Delivery location
- Customer address
- Navigation
- Delivery acceptance rules
- Driver earnings
- Driver delivery history
- Driver payout calculations
- Better dispatch system

---

# 25. Payments

A real payment system has not yet been integrated.

The eventual platform should support a South African payment provider.

Potential requirements include:

- Payment initiation
- Payment confirmation
- Payment status
- Failed payments
- Refunds
- Restaurant settlement
- Driver settlement
- Payment webhooks

Payment integration should be implemented after the core ordering workflow is stable.

---

# 26. Delivery and Maps

Google Maps/location functionality is still outstanding.

Planned functionality includes:

- Customer delivery address
- Restaurant location
- Driver location
- Distance calculation
- Estimated delivery time
- Route/navigation support
- Delivery fee calculation

---

# 27. Driver Communication

The initial MVP concept includes:

- WhatsApp notifications
- SMS notifications

Potential events include:

```text
New delivery available
Order ready for pickup
Delivery assigned
Delivery status updates
```

The exact communication provider has not yet been selected.

---

# 28. Notifications

A future notification system should support:

### Customer

- Order received
- Order accepted
- Order preparing
- Order ready
- Driver assigned
- Order delivered

### Restaurant

- New order
- Order cancellation
- Driver assigned

### Driver

- New delivery
- Delivery cancelled
- Pickup ready

---

# 29. Business and Financial System

Future development will need to introduce proper financial calculations.

These may include:

```text
Order subtotal
+ Delivery fee
= Customer payment

Restaurant commission
- Platform fees
= Restaurant payout

Driver earnings
- Driver platform commission
= Driver payout
```

The final percentages and caps still need to be determined through business modelling.

---

# 30. Admin System

An administrative dashboard is planned.

Potential functionality:

- Manage users
- Manage restaurants
- Manage drivers
- View orders
- Resolve disputes
- Monitor transactions
- Manage commissions
- View platform analytics
- Suspend accounts
- Platform configuration

---

# 31. Production Infrastructure

The current application runs locally.

Development:

```text
Frontend → localhost:3000
Backend  → localhost:8080
PostgreSQL → local database
```

Production deployment is still outstanding.

The eventual infrastructure may include:

```text
Frontend
    ↓
Cloud hosting

Backend
    ↓
Cloud server/container

Database
    ↓
Managed PostgreSQL

External Services
    ├── Payment provider
    ├── Maps
    ├── WhatsApp/SMS
    └── Email
```

The final hosting providers have not yet been selected.

---

# 32. Production Security

Before launching publicly, additional security work is required.

Areas include:

- Environment variables
- Secret management
- Production JWT configuration
- HTTPS
- Database security
- CORS restrictions
- Rate limiting
- Input validation
- Authorization review
- Secure payment webhooks
- Password security
- Account recovery
- Logging
- Monitoring
- Error handling

Sensitive configuration must not be committed to GitHub.

---

# 33. Testing Roadmap

The current project has significant manual browser testing.

Future testing should include:

### Backend

- Unit tests
- Controller tests
- Service tests
- Security tests
- Integration tests

### Frontend

- Component tests
- API tests
- Authentication tests
- Cart tests
- Checkout tests

### End-to-End

Test complete flows such as:

```text
Customer registration
        ↓
Restaurant selection
        ↓
Menu
        ↓
Cart
        ↓
Order
        ↓
Restaurant acceptance
        ↓
Preparation
        ↓
Driver assignment
        ↓
Delivery
        ↓
Customer order history
```

---

# 34. MVP Roadmap

The remaining development roadmap is approximately:

```text
CORE ORDER LIFECYCLE
        ✓
        ↓
AUTHENTICATION / NAVIGATION UX
        ✓
        ↓
CUSTOMER ORDER HISTORY & UX
        ↓
RESTAURANT MANAGEMENT UX
        ↓
DRIVER EXPERIENCE
        ↓
PAYMENTS
        ↓
MAPS / DELIVERY LOCATION
        ↓
NOTIFICATIONS
        ↓
BUSINESS COMMISSION SYSTEM
        ↓
ADMIN DASHBOARD
        ↓
SECURITY HARDENING
        ↓
TESTING
        ↓
DEPLOYMENT
        ↓
PRODUCTION MVP
```

Some items have already been partially implemented and will continue to be improved.

---

# 35. Development Principles

The project is being developed with the following principles:

### Incremental development

Features are implemented one at a time.

### Test before moving on

A feature should be built successfully and browser-tested before committing.

### Small Git checkpoints

Each meaningful milestone gets its own Git commit.

### Avoid unnecessary rewrites

Existing working functionality should not be changed unless there is a reason.

### Keep frontend and backend responsibilities separated

Frontend:

```text
UI
State
User interaction
API communication
```

Backend:

```text
Business logic
Authentication
Authorization
Database
Order processing
```

---

# 36. Running the Project Locally

## Start the backend

From the backend directory:

```bash
cd ~/Food_Delivery_Platform/food-delivery-platform/backend
```

Start the Spring Boot application using the available Maven setup.

The backend runs on:

```text
http://localhost:8080
```

---

## Start the frontend

Open another terminal:

```bash
cd ~/Food_Delivery_Platform/food-delivery-platform/frontend
```

Install dependencies if required:

```bash
npm install
```

Start development:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

# 37. Useful Commands

## Frontend development

```bash
cd ~/Food_Delivery_Platform/food-delivery-platform/frontend
npm run dev
```

## Frontend production build

```bash
npm run build
```

## Git status

```bash
git status
```

## Git add

```bash
git add <file>
```

## Git commit

```bash
git commit -m "Description"
```

## Git push

```bash
git push origin main
```

---

# 38. Current Known Test Accounts

The development environment has included test accounts such as:

```text
Restaurant Test
Driver Test
```

The project has also used test restaurants including:

```text
Test Restaurant
Second Restaurant
```

These are development/test data and should not be considered production accounts.

---

# 39. Current Known Test Data

Example test restaurant:

```text
Test Restaurant
Cape Town
```

Example test menu item:

```text
Test Burger
R75
```

The completed end-to-end test used:

```text
Order #7
```

which successfully reached:

```text
DELIVERED
```

---

# 40. Important Current State

At the current development checkpoint:

```text
Frontend build:        PASSING
Backend:               FUNCTIONAL
Authentication:        WORKING
Customer ordering:     WORKING
Restaurant management: WORKING
Driver delivery:       WORKING
Order lifecycle:       TESTED
Global navigation:     WORKING
Git repository:        CLEAN
GitHub main branch:    UP TO DATE
```

The application has moved beyond the basic backend prototype and now has a working multi-role MVP foundation.

---

# 41. Long-Term Vision

The eventual goal is to turn FoodDelivery into a complete South African food delivery marketplace.

The long-term platform could include:

```text
Customers
    ↓
Restaurants
    ↓
FoodDelivery Platform
    ↓
Drivers
```

with supporting systems for:

- Payments
- Maps
- Dispatch
- Notifications
- Restaurant management
- Driver management
- Customer accounts
- Analytics
- Commission management
- Administration
- Fraud/security controls
- Production infrastructure

The current MVP focuses on proving that the fundamental marketplace workflow works before adding these more complex systems.

---

## Current Development Principle

> **Build the core → test it → commit it → improve it → then add the next system.**

The project should continue to evolve incrementally rather than attempting to implement the entire production platform at once.
