Recharge Application
A web application for managing mobile recharge transactions, built with Next.js, TypeScript, MongoDB Atlas, Mongoose, Tanstack Query, and Tailwind CSS. It provides a RESTful API for CRUD operations on recharges and a user-friendly UI to list, create, update, and delete recharges.
Features

Create, read, update, and delete recharge transactions.
RESTful API with consistent JSON responses ({ success, data, message }).
Responsive UI to manage recharges with real-time updates.
Persistent storage using MongoDB Atlas.
Modular architecture with separated logic and UI components.

Tech Stack

Frontend: Next.js (App Router), TypeScript, Tanstack Query, Tailwind CSS
Backend: Next.js API Routes, Mongoose, MongoDB Atlas
Tools: ESLint, Turbopack

Prerequisites

Node.js (v18 or higher)
MongoDB Atlas account
Git

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd recharge_app


Install Dependencies:
npm install


Set Up Environment Variables:

Create a .env.local file in the project root.
Add your MongoDB Atlas connection string:MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/recharge_app?retryWrites=true&w=majority


Replace <username>, <password>, and <cluster> with your MongoDB Atlas credentials.


Run the Application:
npm run dev


Open http://localhost:3000 in your browser.
Access the recharges UI at http://localhost:3000/recharges.



API Documentation
The app provides the following REST APIs under /api/recharges:



Method
Endpoint
Description



GET
/api/recharges
List all recharges


POST
/api/recharges
Create a new recharge (body: { username, amount, status })


GET
/api/recharges/[id]
Get a recharge by ID


PUT
/api/recharges/[id]
Update a recharge by ID (body: { username?, amount?, status? })


DELETE
/api/recharges/[id]
Delete a recharge by ID


Response Format:
{
  "success": boolean,
  "data": any | null,
  "message": string
}

Example POST Request:
curl -X POST http://localhost:3000/api/recharges -H "Content-Type: application/json" -d '{"username":"john_doe","amount":50,"status":"pending"}'

UI Usage

Main Page (/recharges):
View a table of all recharges (username, amount, date, status).
Use the form to create a new recharge (enter username, amount, select status).
Click "View/Edit" to navigate to a recharge’s detail page.


Detail Page (/recharges/[id]):
View recharge details.
Update fields (username, amount, status) and save changes.
Delete the recharge (with confirmation).


Success/error messages appear for all actions and auto-dismiss after 3 seconds.

Project Structure
recharge_app/
├── app/                    # Next.js App Router
│   ├── api/              # API routes for CRUD operations
│   │   ├── recharges/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── db.ts         # Mongoose connection and schema
│   ├── recharges/
│   │   ├── [id]/page.tsx # Single recharge UI
│   │   └── page.tsx      # Main recharges UI
│   └── globals.css       # Tailwind CSS styles
├── components/            # Reusable UI components
│   └── recharges/
│       ├── RechargeForm.tsx
│       └── RechargeList.tsx
├── lib/                  # API logic and Tanstack Query hooks
│   └── recharge-api.ts
├── .env.local            # Environment variables (MongoDB URI)
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.


