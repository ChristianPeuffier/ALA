# Setup Instructions - ALA Secrets Management Project

## Quick Start Guide

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/ChristianPeuffier/ALA.git
cd ALA

# Install dependencies
cd app
npm install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 3. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test

# Security check
npm run security-check
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Status with secrets info (safe)
curl http://localhost:3000/api/status

# Configuration
curl http://localhost:3000/api/config
```

## GitHub Repository Setup

### 1. Configure Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** and add:

#### Testing Environment
- `TEST_DB_PASSWORD`: `test_password_123`
- `TEST_API_KEY`: `test_api_key_456`
- `TEST_JWT_SECRET`: `test_jwt_secret_789`

#### Staging Environment
- `STAGING_DB_PASSWORD`: `staging_secure_password`
- `STAGING_API_KEY`: `staging_api_key`
- `STAGING_JWT_SECRET`: `staging_jwt_secret`
- `STAGING_DB_HOST`: `staging-db.example.com`

#### Production Environment
- `PROD_DB_PASSWORD`: `production_secure_password`
- `PROD_API_KEY`: `production_api_key`
- `PROD_JWT_SECRET`: `production_jwt_secret`
- `PROD_DB_HOST`: `prod-db.example.com`

### 2. Environment Protection Rules

1. Go to **Settings** → **Environments**
2. Create environments: `testing`, `staging`, `production`
3. Configure protection rules for `production`:
   - Required reviewers
   - Wait timer
   - Deployment branches

## Development Workflow

### 1. Feature Development
```bash
git checkout -b feature/your-feature
# Make changes
git commit -m "feat: your feature"
git push origin feature/your-feature
# Create PR
```

### 2. Testing Secrets Management
```bash
# Run security audit
npm run security-check

# Test with different environment variables
DB_PASSWORD=test123 API_KEY=testkey npm test

# Verify no secrets in logs
npm start 2>&1 | grep -v "password\|secret\|key"
```

### 3. CI/CD Pipeline

The pipeline automatically:
1. **Security Audit**: Scans for hardcoded secrets
2. **Testing**: Runs tests with test secrets
3. **Building**: Creates production-ready build
4. **Deployment**: Deploys to staging/production with environment-specific secrets

## Troubleshooting

### Common Issues

#### 1. "Environment variable not set" error
```bash
# Check which variables are missing
node -e "console.log('Missing:', ['DB_PASSWORD', 'API_KEY', 'JWT_SECRET'].filter(v => !process.env[v]))"
```

#### 2. CI/CD pipeline fails
- Verify secrets are configured in GitHub repository settings
- Check environment names match exactly
- Ensure branch protection rules allow the pipeline

#### 3. Application won't start
```bash
# Check environment file
cat .env

# Verify all required variables
npm run security-check
```

### Debug Commands

```bash
# Check environment variables (safely)
node -e "console.log('Loaded secrets:', Object.keys(process.env).filter(k => k.includes('PASSWORD') || k.includes('KEY') || k.includes('SECRET')).map(k => k + ': ' + (process.env[k] ? 'SET' : 'MISSING')))"

# Test API endpoints
curl -s http://localhost:3000/api/status | jq .

# Check logs for security issues
grep -r "password\|secret\|key" . --exclude-dir=node_modules --exclude-dir=.git
```

## Security Checklist

- [ ] No hardcoded secrets in source code
- [ ] `.env` file is gitignored
- [ ] `.env.example` provides template
- [ ] All API responses avoid exposing secrets
- [ ] Error handlers don't leak sensitive information
- [ ] CI/CD pipeline uses GitHub Secrets
- [ ] Different secrets for each environment
- [ ] Security audit script passes
- [ ] Tests verify secrets are not exposed

## Next Steps

1. **Review Documentation**: Read `docs/secrets-management-guide.md`
2. **Study Examples**: Check `examples/practical-examples.md`
3. **Customize Application**: Modify for your specific use case
4. **Deploy**: Push to trigger CI/CD pipeline
5. **Monitor**: Set up logging and alerting for production