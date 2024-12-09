# JotBot - AI-Enhanced Journal Application

JotBot is a personal journaling application that uses AI to enhance your journal entries. It provides user authentication, secure password management, and AI-powered journal entry enhancement.

## Features

- User authentication (register, login, logout)
- Password reset functionality with email notifications
- AI-enhanced journal entries using OpenAI's API
- CRUD operations for journal entries
- Secure session management
- Mobile-responsive design

## Tech Stack

### Frontend
- React.js
- Axios for API calls
- CSS with responsive design
- Environment-based configuration

### Backend
- Ruby on Rails 7.2.2
- PostgreSQL database
- OpenAI API integration
- Gmail SMTP for emails
- Session-based authentication

## Local Development Setup

### Prerequisites
- Ruby 3.1.2
- Node.js and npm
- PostgreSQL
- Gmail account for mailer
- OpenAI API key

### Backend Setup
```bash
# Clone repository
git clone [your-repository-url]
cd journal_app

# Install Ruby dependencies
bundle install

# Database setup
rails db:create
rails db:migrate

# Create environment file (.env)
RAILS_MASTER_KEY=your_master_key
DATABASE_URL=postgres://username:password@localhost/database_name
SMTP_USERNAME=your_gmail
SMTP_PASSWORD=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key

# Start Rails server
rails s -p 3001
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd journal-client

# Install dependencies
npm install

# Create environment file (.env)
REACT_APP_API_URL=http://localhost:3001

# Start development server
npm start
```

## Production Deployment (AWS EC2)

### Prerequisites
- AWS account
- EC2 instance (t2.small recommended)
- Domain name (optional)

### Deployment Steps
1. Launch EC2 instance with Ubuntu Server 22.04
2. Configure security group to allow ports 80, 443, and 3001
3. Install dependencies (Ruby, Node.js, PostgreSQL, Nginx)
4. Clone repository and set up environment
5. Configure Nginx as reverse proxy
6. Start Rails server and build frontend


## Environment Variables

### Backend (.env.production)
```
# Production Environment Variables
RAILS_ENV=production
RAILS_MASTER_KEY=your_master_key
DATABASE_URL=postgres://username:password@localhost/database_name
SMTP_USERNAME=your_gmail_address
SMTP_PASSWORD=your_gmail_app_password
RAILS_SERVE_STATIC_FILES=true
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env.production)
```
REACT_APP_API_URL=/api
```

## API Endpoints

- `POST /users` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /auth_check` - Check authentication status
- `POST /password_resets` - Request password reset
- `POST /change_password` - Change password
- `GET /journal_entries` - List journal entries
- `POST /journal_entries` - Create journal entry
- `DELETE /journal_entries/:id` - Delete journal entry

## Directory Structure
```
journal_app/
├── app/
│   ├── controllers/
│   ├── models/
│   └── mailers/
├── config/
│   └── environments/
├── journal-client/
│   ├── src/
│   │   ├── components/
│   │   └── styles/
│   └── public/
└── db/
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
