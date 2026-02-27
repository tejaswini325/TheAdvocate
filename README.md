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

## 📚 API Documentation
### Authentication Endpoints
