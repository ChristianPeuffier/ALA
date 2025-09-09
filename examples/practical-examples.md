# Exemples Pratiques - Gestion des Secrets CI/CD

## 1. Exemple INSÉCURISÉ (❌ À NE PAS FAIRE)

### bad-example.js
```javascript
// ❌ DANGER: Secrets hardcodés dans le code
const express = require('express');
const app = express();

// ❌ TRÈS DANGEREUX - Secrets en dur
const config = {
    dbPassword: 'mySecretPassword123',
    apiKey: 'sk-abc123def456ghi789',
    jwtSecret: 'mySuperSecretJWTKey'
};

// ❌ EXPOSITION des secrets dans les logs
console.log('Starting with config:', config);

// ❌ EXPOSITION des secrets dans l'API
app.get('/config', (req, res) => {
    res.json(config); // Expose tout!
});

// ❌ Erreurs qui exposent des secrets
app.use((err, req, res, next) => {
    console.error('Error with config:', config, err);
    res.status(500).json({ error: err.message, config: config });
});
```

### Problèmes de cet exemple:
- Secrets visibles dans le code source
- Secrets committé dans Git
- Secrets exposés dans les logs
- Secrets envoyés dans les réponses API
- Secrets dans les messages d'erreur

---

## 2. Exemple SÉCURISÉ (✅ BONNE PRATIQUE)

### secure-example.js
```javascript
// ✅ BON: Utilisation des variables d'environnement
const express = require('express');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// ✅ BON: Configuration sécurisée
const config = {
    dbPassword: process.env.DB_PASSWORD,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET
};

// ✅ BON: Validation des secrets sans les exposer
const requiredSecrets = ['DB_PASSWORD', 'API_KEY', 'JWT_SECRET'];
const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);

if (missingSecrets.length > 0) {
    console.error('❌ Secrets manquants:', missingSecrets);
    process.exit(1);
}

// ✅ BON: Logging sécurisé (masque les valeurs)
console.log('✅ Configuration chargée:', {
    dbPasswordSet: !!config.dbPassword,
    apiKeySet: !!config.apiKey,
    jwtSecretSet: !!config.jwtSecret
});

// ✅ BON: API qui ne expose pas les secrets
app.get('/config', (req, res) => {
    res.json({
        environment: process.env.NODE_ENV,
        features: {
            databaseEnabled: !!config.dbPassword,
            apiEnabled: !!config.apiKey,
            authEnabled: !!config.jwtSecret
        }
    });
});

// ✅ BON: Gestion d'erreurs sécurisée
app.use((err, req, res, next) => {
    // Log de l'erreur côté serveur (sans secrets)
    console.error('Application error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    
    // Réponse client (sans information sensible)
    res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});
```

---

## 3. Configuration GitHub Actions Sécurisée

### .github/workflows/secure-deployment.yml
```yaml
name: Secure Deployment Example

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      # ✅ BON: Secrets référencés via GitHub Secrets
      - name: Deploy with secrets
        env:
          DB_PASSWORD: ${{ secrets.PROD_DB_PASSWORD }}
          API_KEY: ${{ secrets.PROD_API_KEY }}
          JWT_SECRET: ${{ secrets.PROD_JWT_SECRET }}
        run: |
          # ✅ BON: Vérification sans exposition
          echo "Checking secrets availability..."
          [ ! -z "$DB_PASSWORD" ] && echo "✅ DB_PASSWORD loaded" || echo "❌ DB_PASSWORD missing"
          [ ! -z "$API_KEY" ] && echo "✅ API_KEY loaded" || echo "❌ API_KEY missing"
          [ ! -z "$JWT_SECRET" ] && echo "✅ JWT_SECRET loaded" || echo "❌ JWT_SECRET missing"
          
          # ✅ BON: Déploiement sans exposer les secrets
          echo "Deploying application..."
          # La commande de déploiement utiliserait les secrets via les variables d'environnement
```

---

## 4. Tests avec Secrets

### secure-test.js
```javascript
// ✅ BON: Tests sécurisés
const request = require('supertest');
const app = require('./secure-example');

describe('Security Tests', () => {
    beforeAll(() => {
        // ✅ BON: Configuration de test sécurisée
        process.env.DB_PASSWORD = 'test-db-password';
        process.env.API_KEY = 'test-api-key';
        process.env.JWT_SECRET = 'test-jwt-secret';
    });

    test('Should not expose secrets in config endpoint', async () => {
        const response = await request(app)
            .get('/config')
            .expect(200);
        
        // ✅ BON: Vérifier que les secrets ne sont pas exposés
        const responseBody = JSON.stringify(response.body);
        expect(responseBody).not.toContain('test-db-password');
        expect(responseBody).not.toContain('test-api-key');
        expect(responseBody).not.toContain('test-jwt-secret');
        
        // ✅ BON: Vérifier que le statut est disponible
        expect(response.body.features.databaseEnabled).toBe(true);
        expect(response.body.features.apiEnabled).toBe(true);
        expect(response.body.features.authEnabled).toBe(true);
    });

    test('Should handle errors without exposing secrets', async () => {
        // ✅ Simuler une erreur
        const response = await request(app)
            .get('/nonexistent')
            .expect(404);
        
        // ✅ Vérifier qu'aucun secret n'est dans la réponse d'erreur
        const responseBody = JSON.stringify(response.body);
        expect(responseBody).not.toContain(process.env.DB_PASSWORD);
        expect(responseBody).not.toContain(process.env.API_KEY);
        expect(responseBody).not.toContain(process.env.JWT_SECRET);
    });
});
```

---

## 5. Script de Vérification de Sécurité

### security-audit.js
```javascript
// ✅ BON: Script d'audit automatisé
const fs = require('fs');
const path = require('path');

function auditSecrets() {
    console.log('🔍 Audit de sécurité des secrets...\n');
    
    // Vérifier les fichiers potentiellement dangereux
    const filesToCheck = [
        'package.json',
        'server.js',
        'config.js',
        '.env.example'
    ];
    
    const dangerousPatterns = [
        /password\s*[:=]\s*["'][^"']{3,}["']/i,
        /secret\s*[:=]\s*["'][^"']{3,}["']/i,
        /key\s*[:=]\s*["'][^"']{8,}["']/i,
        /token\s*[:=]\s*["'][^"']{8,}["']/i
    ];
    
    let issues = 0;
    
    filesToCheck.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            dangerousPatterns.forEach((pattern, index) => {
                if (pattern.test(content)) {
                    console.log(`❌ Possible secret détecté dans ${file}`);
                    issues++;
                }
            });
        }
    });
    
    // Vérifier que .env n'est pas committé
    if (fs.existsSync('.env')) {
        console.log('⚠️  Fichier .env détecté - vérifier .gitignore');
    }
    
    // Vérifier .gitignore
    if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        if (!gitignore.includes('.env')) {
            console.log('❌ .env n\'est pas dans .gitignore');
            issues++;
        }
    }
    
    if (issues === 0) {
        console.log('✅ Aucun problème de sécurité détecté');
    } else {
        console.log(`❌ ${issues} problème(s) de sécurité détecté(s)`);
        process.exit(1);
    }
}

auditSecrets();
```

---

## 6. Configuration Docker Sécurisée

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# ✅ BON: Copier les fichiers nécessaires
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ✅ BON: Ne pas copier les secrets
# Les secrets seront injectés via variables d'environnement

# ✅ BON: Utilisateur non-root
USER node

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      # ✅ BON: Secrets via variables d'environnement
      - NODE_ENV=production
      - DB_HOST=db
      - DB_NAME=myapp
      - DB_USER=appuser
      # ✅ Ces secrets viendraient d'un fichier .env ou du système
      - DB_PASSWORD=${DB_PASSWORD}
      - API_KEY=${API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Points Clés à Retenir

### ✅ Bonnes Pratiques
1. **Jamais de secrets hardcodés** dans le code
2. **Variables d'environnement** pour tous les secrets
3. **Validation** de la présence des secrets sans les exposer
4. **Logging sécurisé** (booléens au lieu de valeurs)
5. **Tests** qui vérifient l'absence d'exposition
6. **Audit automatisé** des secrets potentiels

### ❌ Erreurs Communes
1. Secrets dans le code source
2. Exposition dans les logs
3. Secrets dans les réponses API
4. Même secrets entre environnements
5. Pas de validation des secrets
6. Fichiers .env committés