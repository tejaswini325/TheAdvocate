# ⚖️ TheAdvocate - Attorney Case Management Dashboard

**Navigate Justice with Ease**

A comprehensive full-stack MERN application designed for law firms and attorneys to efficiently manage clients, cases, tasks, and documents. TheAdvocate provides a professional dashboard with real-time analytics, complete CRUD operations, and a clean, intuitive interface.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin/Associate)
- Password hashing with bcrypt
- Protected routes and API endpoints

### 📊 Dashboard Analytics
- Real-time statistics cards (Total Cases, Open Cases, Tasks, Completion Rate)
- Interactive charts for case status distribution
- Priority-based case visualization
- Document status tracking
- Task completion progress
- Recent cases table with quick access

### 👥 Client Management
- Full CRUD operations
- Search clients by name, email, or phone
- Client avatars with initials
- Contact information with icons
- Pagination for large datasets
- View cases associated with each client

### ⚖️ Case Management
- Complete case tracking
- Status tracking (Open, In Progress, Pending Review, Closed)
- Priority levels (Low, Medium, High)
- Case type categorization
- Next hearing date tracking
- Assign attorneys to cases
- Advanced filtering by status, priority, type
- Search by case number or title

### ✅ Task Management
- Create and assign tasks to cases
- Track completion percentage
- Due date monitoring with color indicators
- Status toggle (Pending/Completed)
- Progress bars for visual tracking
- Filter by task status
- Sort by due date, priority, or case

### 📄 Document Management
- Upload documents (PDF, DOC, DOCX, images)
- View documents in browser
- Download documents
- Document status tracking (Pending, Reviewed, Approved)
- Associate documents with specific cases
- Filter by document status
- Preview thumbnails for images

### 🔍 Search & Filters
- Global search across all modules
- Advanced filtering options
- Real-time search results
- Sortable columns in all tables

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Collapsible sidebar for mobile view
- Touch-friendly interface

### 🎨 UI/UX Features
- Clean, professional design
- Gradient headers and cards
- Smooth animations and transitions
- Hover effects on interactive elements
- Toast notifications for actions
- Confirmation modals for deletions
- Loading states and skeletons
- Empty state illustrations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Navigation and routing |
| **Tailwind CSS** | Styling and responsive design |
| **Recharts** | Interactive charts and graphs |
| **Axios** | API requests |
| **React Hot Toast** | Toast notifications |
| **React Icons** | Icon library |
| **Date-fns** | Date formatting |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Bcryptjs** | Password hashing |
| **Multer** | File uploads |
| **Express Validator** | Input validation |
| **CORS** | Cross-origin resource sharing |

---

## 📥 Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/tejaswini325/TheAdvocate.git
cd theadvocate
```
### Step 2: Clone the Repository

``` bash
# Navigate to backend directory
cd backend
```
```bash
# Install dependencies
npm install
```

```bash
# Create .env file
cp .env.example .env
```
```bash
# Edit .env with your values (see Environment Variables section)
```
```bash
# Seed the database with demo data
npm run seed
```
```bash
# Start development server
npm run dev
```
The backend will run at http://localhost:5000

### Step 3: Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The frontend will run at http://localhost:5173

### Step 4: Access the Application
Open your browser and go to http://localhost:5173

## 📚 API Endpoints

---

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

---

### 👥 Client Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | `/api/clients` | Get all clients | Private |
| GET | `/api/clients/:id` | Get single client | Private |
| POST | `/api/clients` | Create new client | Admin |
| PUT | `/api/clients/:id` | Update client | Admin |
| DELETE | `/api/clients/:id` | Delete client | Admin |
| GET | `/api/clients/search/:query` | Search clients | Private |

---

### ⚖️ Case Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | `/api/cases` | Get all cases | Private |
| GET | `/api/cases/:id` | Get single case | Private |
| POST | `/api/cases` | Create new case | Private |
| PUT | `/api/cases/:id` | Update case | Private |
| DELETE | `/api/cases/:id` | Delete case | Admin |
| GET | `/api/cases/client/:clientId` | Get cases by client | Private |
| GET | `/api/cases/search/:query` | Search cases | Private |

---

### ✅ Task Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | `/api/tasks` | Get all tasks | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| POST | `/api/tasks` | Create new task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| GET | `/api/tasks/case/:caseId` | Get tasks by case | Private |

---

### 📄 Document Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | `/api/documents` | Get all documents | Private |
| GET | `/api/documents/:id` | Get single document | Private |
| POST | `/api/documents` | Upload document | Private |
| PUT | `/api/documents/:id` | Update document | Private |
| DELETE | `/api/documents/:id` | Delete document | Admin |
| GET | `/api/documents/case/:caseId` | Get documents by case | Private |
| GET | `/api/documents/download/:id` | Download document | Public |
| GET | `/api/documents/view/:id` | View document | Public |

---

### 📊 Dashboard Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Private |

---

### 💾 Database Schema
## Users Collection
```bash
{
  name: String (required),
  email: String (unique, required),
  password: String (required, hashed),
  role: String (enum: ['Admin', 'Associate'], default: 'Associate'),
  createdAt: Date,
  updatedAt: Date
}
```
## Clients Collection
```bash
{
  name: String (required),
  email: String (unique, required),
  phone: String (required),
  address: String (required),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```
## Cases Collection
```bash
{
  caseTitle: String (required),
  caseNumber: String (unique, required),
  clientId: ObjectId (ref: Client, required),
  caseType: String (required),
  status: String (enum: ['Open', 'In Progress', 'Pending Review', 'Closed'], default: 'Open'),
  priority: String (enum: ['Low', 'Medium', 'High'], default: 'Medium'),
  description: String (required),
  startDate: Date (required),
  nextHearingDate: Date,
  assignedTo: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```
## Tasks Collection
```bash
{
  caseId: ObjectId (ref: Case, required),
  taskTitle: String (required),
  assignedTo: ObjectId (ref: User, required),
  dueDate: Date (required),
  status: String (enum: ['Pending', 'Completed'], default: 'Pending'),
  completionPercentage: Number (min: 0, max: 100, default: 0),
  createdAt: Date,
  updatedAt: Date
}
```
## Documents Collection
```bash
{
  caseId: ObjectId (ref: Case, required),
  documentName: String (required),
  documentType: String (required),
  status: String (enum: ['Pending', 'Reviewed', 'Approved'], default: 'Pending'),
  fileUrl: String (required),
  fileSize: Number,
  mimeType: String,
  uploadedBy: ObjectId (ref: User),
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Navigating the Dashboard

- **Dashboard** – Overview of all activities with charts and statistics  
- **Clients** – Manage all client information  
- **Cases** – Track and manage all legal cases  
- **Tasks** – Monitor, assign, and update tasks  
- **Documents** – Upload, view, and manage case-related documents  

---

## ✨ Key Actions

- **Add New** – Click the blue "Add New" button available on each page  
- **Edit** – Hover over a row and click the edit icon  
- **Delete** – Hover over a row and click the delete icon (Admins only)  
- **Search** – Use the search bar at the top of each page  
- **Filter** – Click the "Filters" button to narrow down results  
- **View Document** – Click the eye icon on any document  
- **Download Document** – Click the download icon to save the document locally  

---

### 📁 Structure of the project
```bash
theadvocate/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # Configuration files
│   │   └── seed.js           # Database seeder
│   ├── uploads/              # Uploaded files
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── server.js             # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/              # API service layers
│       ├── components/        # Reusable components
│       │   ├── layout/        # Layout components
│       │   ├── common/        # Common components
│       │   ├── cards/         # Card components
│       │   ├── charts/        # Chart components
│       │   └── forms/         # Form components
│       ├── pages/             # Page components
│       │   ├── auth/          # Authentication pages
│       │   ├── dashboard/     # Dashboard page
│       │   ├── clients/       # Clients page
│       │   ├── cases/         # Cases page
│       │   ├── tasks/         # Tasks page
│       │   └── documents/     # Documents page
│       ├── hooks/             # Custom React hooks
│       ├── context/           # React context providers
│       ├── utils/             # Helper functions
│       ├── App.jsx
│       └── main.jsx
├── .gitignore
└── README.md
```

---

### 📄 License
This project is licensed under the MIT License

---

### 👨‍💻 Author
#### Tejaswini M V
GitHub: https://github.com/tejaswini325
Email: tejaswinimv0102@gmail.com

