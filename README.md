# MeetKats - Social Portfolio Platform

MeetKats is a modern social platform where professionals can connect, share achievements, collaborate on projects, and build their digital portfolio.

## 🚀 Features

### Portfolio System
- **Projects**
  - Create and manage professional projects
  - Add collaborators and track contributions
  - Upload attachments and link external resources
  - Set visibility (public/private/connections)
  - Tag skills and categories

- **Achievements**
  - Document professional accomplishments
  - Upload certificates and credentials
  - Get endorsements from peers
  - Verify achievements with certificate URLs

- **Skills & Endorsements**
  - Add professional skills
  - Receive skill endorsements
  - Track skill growth over time

### Social Features
- **Posts & Content**
  - Share updates, articles, and media
  - Support for text, images, videos, and links
  - Interactive reactions and comments
  - Content moderation system

- **Networking**
  - Connect with other professionals
  - Follow companies and organizations
  - Real-time messaging system
  - Mention users in posts and comments

### Discovery
- **Events**
  - Create and discover professional events
  - Track attendance and engagement
  - Location-based event discovery

- **Jobs**
  - Post and find job opportunities
  - Track application status
  - Company profiles and verification

## 🛠️ Technical Stack

### Frontend
- React + Vite
- TailwindCSS for styling
- Lucide icons
- Real-time updates with WebSocket

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## 📦 Project Structure

```
meetkats_website/
├── webappy/
│   ├── frontend/           # React frontend application
│   │   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   └── pages/         # Page components
│   └── api/               # Express backend server
│       ├── models/        # Mongoose models
│       └── controllers/   # Route controllers
└── new-backend/          # New backend implementation
    ├── models/           # Updated data models
    ├── controllers/      # Business logic
    └── index.js         # Server entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd meetkats_website
```

2. Install frontend dependencies:
```bash
cd webappy/frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../api
npm install
```

4. Configure environment variables:
Create `.env` files in both frontend and backend directories with required configurations.

5. Start development servers:
```bash
# Start frontend
cd webappy/frontend
npm run dev

# Start backend
cd ../api
npm run start
```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Content moderation system
- Report management
- Two-factor authentication support

## 📝 Data Models

### Key Entities
- Users
- Projects
- Achievements
- Skills
- Posts
- Companies
- Events
- Jobs

## 🤝 Contributing for Organization Members only

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- [Team members and roles are displayed later]

## 📞 Support

For support, email [support@meetkats.com] or join our Discord community.

## 🔄 Version History

- v1.0.0 - Initial release

## 🙏 Acknowledgments

---
Built with ❤️ by the MeetKats Team
