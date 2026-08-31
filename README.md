--Home Inventory Manager

An app used for tracking household inventory items. It has register page, log in page, add/edit/delete items functionalities,
and an admin page for admins to manage users. It is Built with an Express and MongoDB for backend and a plain
HTML, CSS amd JavaScript frontend.

--Project Structure

home-inventory-manager/
├── backend/ Express + Mongoose + JWT API
│ ├── config/ MongoDB connection
│ ├── controllers/ Route handler logic (auth, items, admin)
│ ├── middleware/ JWT auth guard + admin-only guard
│ ├── models/ Mongoose schemas (User, Item)
│ ├── routes/ Express route definitions
│ ├── server.js App entry point
│
├── frontend/ Plain HTML, CSS, JS pages
│ ├── register.html / script.js / styles.css
│ ├── login.html / login-script.js / login-styles.css
│ ├── inventory.html / inventory-script.js / inventory-styles.css
│ ├── add-item.html / edit-item.html / item-form-script.js / item-form-styles.css
│ ├── edit-item-script.js
│ ├── admin-dashboard.html / admin-script.js / admin-styles.css
│ └── api-config.js Shared fetch helper + JWT session storage
│
├── package.json Root convenience scripts
└── .gitignore

--Setup

Backend

cd backend
npm install
npm run dev

Runs on `http://localhost:5001`.

Frontend
Open register.html or login.html in a browser.

Flow

Register → Login → My Inventory → Add Item / Edit Item,
Admin Dashboard for accounts with role: 'Admin'.
