# Attorney Case Management Dashboard 
 
A comprehensive full-stack MERN application designed for law firms and attorneys to manage clients, cases, tasks, and documents efficiently. 
 
## ?? Features 
 
- **User Authentication**: Secure JWT-based authentication with role-based access (Admin/Associate) 
- **Dashboard Analytics**: Interactive charts and statistics for case status, priority distribution, and task completion 
- **Client Management**: Full CRUD operations for client information with search functionality 
- **Case Management**: Track cases with status, priority, hearing dates, and assigned attorneys 
- **Task Management**: Create and monitor tasks with completion percentage tracking 
- **Document Management**: Upload and manage case-related documents 
- **Global Search**: Search across clients and cases 
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS 
 
## ??? Tech Stack 
 
### Backend 
- MongoDB with Mongoose ODM 
- JWT Authentication 
- bcrypt for password hashing 
- Express Validator for input validation 
 
### Frontend 
- React 18 with Vite 
- React Router v6 for navigation 
- Tailwind CSS for styling 
- Recharts for data visualization 
- Axios for API calls 
- React Hot Toast for notifications 
 
## ?? Project Structure 
 
``` 
attorney-case-management/ 
ÃÄÄ backend/ 
³   ÃÄÄ src/ 
³   ³   ÃÄÄ models/          # Database models 
³   ³   ÃÄÄ routes/           # API routes 
³   ³   ÃÄÄ controllers/      # Route controllers 
³   ³   ÃÄÄ middleware/       # Custom middleware 
³   ³   ÃÄÄ utils/            # Utility functions 
³   ³   ÃÄÄ config/           # Configuration files 
³   ³   ÀÄÄ seed.js           # Database seeder 
³   ÃÄÄ .env.example          # Environment variables template 
³   ÃÄÄ package.json 
³   ÀÄÄ server.js             # Entry point 
ÃÄÄ frontend/ 
³   ÃÄÄ public/ 
³   ÀÄÄ src/ 
³       ÃÄÄ api/              # API service layers 
³       ÃÄÄ components/       # Reusable components 
³       ÃÄÄ pages/            # Page components 
³       ÃÄÄ hooks/            # Custom React hooks 
³       ÃÄÄ context/          # React context providers 
³       ÃÄÄ utils/            # Helper functions 
³       ÃÄÄ App.jsx 
³       ÀÄÄ main.jsx 
ÃÄÄ .gitignore 
ÀÄÄ README.md 
``` 
 
## ?? Installation 
 
### Prerequisites 
- Node.js (v14 or higher) 
- MongoDB Atlas account or local MongoDB installation 
- npm or yarn package manager 
 
### Backend Setup 
 
1. Navigate to backend directory: 
   ```bash 
   cd backend 
   ``` 
 
2. Install dependencies: 
   ```bash 
   npm install 
   ``` 
 
3. Create .env file: 
   ```bash 
   cp .env.example .env 
   ``` 
 
4. Update the .env file with your MongoDB URI and JWT secret 
 
5. Seed the database with sample data: 
   ```bash 
   npm run seed 
   ``` 
 
6. Start the development server: 
   ```bash 
   npm run dev 
   ``` 
 
### Frontend Setup 
 
1. Navigate to frontend directory: 
   ```bash 
   cd frontend 
   ``` 
 
2. Install dependencies: 
   ```bash 
   npm install 
   ``` 
 
3. Create .env file: 
   ```bash 
   cp .env.example .env 
   ``` 
 
4. Start the development server: 
   ```bash 
   npm run dev 
   ``` 
 
## ?? Environment Variables 
 
### Backend (.env) 
```env 
NODE_ENV=development 
PORT=5000 
MONGODB_URI=your_mongodb_connection_string 
JWT_SECRET=your_jwt_secret_key 
JWT_EXPIRES_IN=7d 
CLIENT_URL=http://localhost:5173 
``` 
 
### Frontend (.env) 
```env 
VITE_API_URL=http://localhost:5000/api 
VITE_APP_NAME="Attorney Case Management" 
``` 
 
## ?? API Documentation 
 
### Authentication Endpoints 
- `POST /api/auth/register` - Register new user 
- `POST /api/auth/login` - User login 
- `GET /api/auth/me` - Get current user info 
 
### Client Endpoints 
- `GET /api/clients` - Get all clients (paginated) 
- `GET /api/clients/:id` - Get single client 
- `POST /api/clients` - Create new client 
- `PUT /api/clients/:id` - Update client 
- `DELETE /api/clients/:id` - Delete client 
- `GET /api/clients/search/:query` - Search clients 
 
### Case Endpoints 
- `GET /api/cases` - Get all cases (with filters) 
- `GET /api/cases/:id` - Get single case 
- `POST /api/cases` - Create new case 
- `PUT /api/cases/:id` - Update case 
- `DELETE /api/cases/:id` - Delete case 
- `GET /api/cases/client/:clientId` - Get cases by client 
- `GET /api/cases/search/:query` - Search cases 
 
### Task Endpoints 
- `GET /api/tasks` - Get all tasks 
- `GET /api/tasks/:id` - Get single task 
- `POST /api/tasks` - Create new task 
- `PUT /api/tasks/:id` - Update task 
- `DELETE /api/tasks/:id` - Delete task 
- `GET /api/tasks/case/:caseId` - Get tasks by case 
 
### Document Endpoints 
- `GET /api/documents` - Get all documents 
- `GET /api/documents/:id` - Get single document 
- `POST /api/documents` - Create new document 
- `PUT /api/documents/:id` - Update document 
- `DELETE /api/documents/:id` - Delete document 
- `GET /api/documents/case/:caseId` - Get documents by case 
 
### Dashboard Endpoints 
- `GET /api/dashboard/stats` - Get dashboard statistics 
 
## ?? Database Schema 
 
### Users Collection 
- `name`: String (required) 
- `email`: String (unique, required) 
- `password`: String (required, hashed) 
- `role`: Enum ['Admin', 'Associate'] 
- Timestamps: createdAt, updatedAt 
 
### Clients Collection 
- `name`: String (required) 
- `email`: String (unique, required) 
- `phone`: String (required) 
- `address`: String (required) 
- `notes`: String 
- Timestamps: createdAt, updatedAt 
 
### Cases Collection 
- `caseTitle`: String (required) 
- `caseNumber`: String (unique, required) 
- `clientId`: ObjectId (ref: Client) 
- `caseType`: String (required) 
- `status`: Enum ['Open', 'In Progress', 'Pending Review', 'Closed'] 
- `priority`: Enum ['Low', 'Medium', 'High'] 
- `description`: String (required) 
- `startDate`: Date 
- `nextHearingDate`: Date 
- `assignedTo`: ObjectId (ref: User) 
- Timestamps: createdAt, updatedAt 
 
### Tasks Collection 
- `caseId`: ObjectId (ref: Case) 
- `taskTitle`: String (required) 
- `dueDate`: Date (required) 
- `status`: Enum ['Pending', 'Completed'] 
- `completionPercentage`: Number (0-100) 
- Timestamps: createdAt, updatedAt 
 
### Documents Collection 
- `caseId`: ObjectId (ref: Case) 
- `documentName`: String (required) 
- `documentType`: String (required) 
- `status`: Enum ['Pending', 'Reviewed', 'Approved'] 
- `uploadedAt`: Date 
- Timestamps: createdAt, updatedAt 
 
## ?? Deployment 
 
### Deploy Backend to Render 
 
1. Push your code to a GitHub repository 
2. Create a new Web Service on Render 
3. Connect your GitHub repository 
4. Configure the service: 
   - Name: `attorney-case-management-api` 
   - Environment: `Node` 
   - Build Command: `npm install` 
   - Start Command: `npm start` 
5. Add environment variables from your `.env` file 
6. Deploy the service 
 
### Deploy Frontend to Vercel 
 
1. Navigate to frontend directory 
2. Install Vercel CLI: `npm i -g vercel` 
3. Run `vercel` and follow the prompts 
4. Set up environment variables in Vercel dashboard 
5. Deploy: `vercel --prod` 
 
### MongoDB Atlas 
 
1. Create a MongoDB Atlas account 
2. Create a new cluster 
3. Configure database access and network access 
4. Get your connection string and update the backend `.env` file 
 
## ?? Screenshots 
 
*Screenshots will be added here* 
 
## ????? Author 
 
**Your Name** 
- GitHub: [@yourusername](https://github.com/yourusername) 
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile) 
- Email: your.email@example.com 
 
## ?? License 
 
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
 
## ?? Acknowledgments 
 
- MongoDB for the database 
- Express.js team for the backend framework 
- React team for the frontend library 
- All open-source contributors whose libraries made this project possible 
