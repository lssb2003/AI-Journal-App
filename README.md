# JotBot - AI-Enhanced Journal Application

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-development)
- [Maintenance](#maintenance)
- [License](#license)
- [Contributing](#contributing)
- [Live demo](#live-demo)

<h2 id="overview">Overview</h2>
JotBot is a personal journaling application that enhances your journal entries using artificial intelligence. Write your thoughts naturally, and our AI will help improve and expand your entries while maintaining your original meaning.

<h2 id="features">Features</h2>
- **User Authentication**
  - Secure registration and login system
  - Email-based password reset functionality
  - Session management for secure access
  
- **Journal Management**
  - Create and delete journal entries
  - AI-powered enhancement of journal content
  - Chronological display of entries
  
- **Security**
  - Encrypted password storage
  - Secure session handling
  - Protected API endpoints

<h2 id="local-development-setup">Local Development Setup</h2>

### Prerequisites
- Ruby 3.1.2
- Node.js v18+
- PostgreSQL 12+
- Git
- Text editor (VSCode recommended)

### Step 1: Database Setup
```bash
# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database user
sudo -u postgres createuser -s journal_user

# Set user password
sudo -u postgres psql
postgres=# \password journal_user
# Enter your chosen password
postgres=# \q
```

### Step 2: Backend Setup
```bash
# Clone repository
git clone <your-repository-url>
cd journal_app

# Install Ruby dependencies
bundle install

# Create development database
rails db:create
rails db:migrate

# Create development environment file
touch .env
```

Add the following to your `.env` file (replace with your values):
```plaintext
DATABASE_URL=postgres://username:password@localhost/journal_app_development
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
OPENAI_API_KEY=your_openai_api_key
```

```bash
# Start Rails server
rails s -p 3001
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd journal-client

# Install dependencies
npm install

# Create development environment file
touch .env
```

Add to `.env`:
```plaintext
REACT_APP_API_URL=http://localhost:3001
```

```bash
# Start development server
npm start
```

<h2 id="production-development">Production Deployment (AWS EC2)</h2>

### Prerequisites
- AWS account with EC2 access
- Domain name (optional)
- SSH client

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Choose:
   - Ubuntu Server 22.04 LTS
   - t2.small instance type
   - Create new key pair (download .pem file)
3. Configure Security Group:
   - Allow SSH (Port 22)
   - Allow HTTP (Port 80)
   - Allow HTTPS (Port 443)
   - Allow Custom TCP (Port 3001)

### Step 2: Connect to Instance
```bash
# Move key file to secure location
mkdir -p ~/.ssh
mv ~/Downloads/your-key.pem ~/.ssh/
chmod 400 ~/.ssh/your-key.pem

# Connect to instance
ssh -i ~/.ssh/your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git nginx postgresql postgresql-contrib \
    build-essential libssl-dev zlib1g-dev libyaml-dev \
    libreadline-dev libpq-dev

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Ruby via rbenv
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
rbenv install 3.1.2
rbenv global 3.1.2

# Install bundler
gem install bundler
```

### Step 4: Deploy Application
```bash
# Setup application directory
sudo mkdir -p /var/www/journal-app
sudo chown ubuntu:ubuntu /var/www/journal-app
cd /var/www/journal-app
git clone <your-repository-url> .

# Create production environment file
touch .env.production
```

Add to `.env.production` (replace with your values):
```plaintext
RAILS_ENV=production
DATABASE_URL=postgres://username:password@localhost/journal_app_production
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
RAILS_SERVE_STATIC_FILES=true
OPENAI_API_KEY=your_openai_api_key
```

```bash
# Install dependencies and setup database
bundle install
RAILS_ENV=production rails db:create db:migrate

# Build frontend
cd journal-client
npm install
npm run build
```

### Step 5: Configure Nginx
Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/journal-app
```

Add:
```nginx
server {
    listen 80;
    server_name _;

    root /var/www/journal-app/journal-client/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable configuration:
```bash
sudo ln -s /etc/nginx/sites-available/journal-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Start Application
```bash
cd /var/www/journal-app
RAILS_ENV=production rails s -p 3001 -d
```

<h2 id="maintenance">Maintenance</h2>

### Updating Application
```bash
# Pull latest changes
cd /var/www/journal-app
git pull

# Update backend
bundle install
RAILS_ENV=production rails db:migrate

# Update frontend
cd journal-client
npm install
npm run build

# Restart services
sudo systemctl restart nginx
kill -9 $(lsof -i:3001 -t)
RAILS_ENV=production rails s -p 3001 -d
```

### Monitoring
- Check Rails logs: `tail -f log/production.log`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check running processes: `ps aux | grep rails`

## Support
For any issues or questions, please:
1. Check the logs for errors
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Create an issue in the GitHub repository

<h2 id="contributing">Contributing</h2>
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

<h2 id="license">License</h2>
This project is licensed under the MIT License - see the LICENSE file for details.

<h2 id="live-demo">Live demo</h2>
The application is deployed and can be accessed at: http://18.136.119.14
