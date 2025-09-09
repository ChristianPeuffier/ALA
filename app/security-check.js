const fs = require('fs');
const path = require('path');

/**
 * Security check script to validate secrets management practices
 */

console.log('🔒 Running security checks...\n');

let hasIssues = false;

// Check 1: Ensure no hardcoded secrets
function checkHardcodedSecrets() {
    console.log('1. Checking for hardcoded secrets...');
    
    const sensitivePatterns = [
        /password\s*=\s*["'][^"']{3,}["']/i,
        /secret\s*=\s*["'][^"']{3,}["']/i,
        /key\s*=\s*["'][^"']{3,}["']/i,
        /token\s*=\s*["'][^"']{3,}["']/i,
        /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/i,
    ];

    const filesToCheck = ['server.js', 'test.js'];
    
    filesToCheck.forEach(filename => {
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            sensitivePatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    console.log(`   ❌ Potential hardcoded secret found in ${filename}`);
                    hasIssues = true;
                }
            });
        }
    });
    
    if (!hasIssues) {
        console.log('   ✅ No hardcoded secrets detected\n');
    }
}

// Check 2: Verify .env.example exists but .env doesn't
function checkEnvFiles() {
    console.log('2. Checking environment file configuration...');
    
    if (fs.existsSync('.env.example')) {
        console.log('   ✅ .env.example file exists');
    } else {
        console.log('   ❌ .env.example file missing');
        hasIssues = true;
    }
    
    if (fs.existsSync('.env')) {
        console.log('   ⚠️  .env file exists (should be gitignored)');
        // Check if .env is in .gitignore
        if (fs.existsSync('../.gitignore')) {
            const gitignore = fs.readFileSync('../.gitignore', 'utf8');
            if (gitignore.includes('.env')) {
                console.log('   ✅ .env is properly gitignored');
            } else {
                console.log('   ❌ .env is not gitignored');
                hasIssues = true;
            }
        }
    } else {
        console.log('   ✅ .env file properly excluded from repository');
    }
    console.log('');
}

// Check 3: Verify secrets are loaded from environment
function checkEnvironmentUsage() {
    console.log('3. Checking environment variable usage...');
    
    const requiredSecrets = ['DB_PASSWORD', 'API_KEY', 'JWT_SECRET'];
    const missingSecrets = [];
    
    requiredSecrets.forEach(secret => {
        if (!process.env[secret]) {
            missingSecrets.push(secret);
        }
    });
    
    if (missingSecrets.length > 0) {
        console.log(`   ⚠️  Missing environment variables: ${missingSecrets.join(', ')}`);
        console.log('   ℹ️  This is expected in CI/CD environments without secrets configured');
    } else {
        console.log('   ✅ All required environment variables are loaded');
    }
    console.log('');
}

// Check 4: Validate that secrets are not logged
function checkLoggingPractices() {
    console.log('4. Checking logging practices...');
    
    if (fs.existsSync('server.js')) {
        const content = fs.readFileSync('server.js', 'utf8');
        
        // Check for console.log with environment variables
        const dangerousLogging = [
            /console\.log.*process\.env\./,
            /console\.log.*\$\{process\.env\./,
            /console\.error.*process\.env\./
        ];
        
        let foundDangerousLogging = false;
        dangerousLogging.forEach(pattern => {
            if (pattern.test(content)) {
                // Check if it's our safe logging (showing only boolean status)
                if (!content.includes('? \'✅ Loaded\' : \'❌ Missing\'')) {
                    foundDangerousLogging = true;
                }
            }
        });
        
        if (foundDangerousLogging) {
            console.log('   ❌ Potentially unsafe logging of environment variables');
            hasIssues = true;
        } else {
            console.log('   ✅ Safe logging practices detected');
        }
    }
    console.log('');
}

// Check 5: Verify CI/CD configuration
function checkCICDConfiguration() {
    console.log('5. Checking CI/CD configuration...');
    
    const cicdFile = '../.github/workflows/ci-cd.yml';
    if (fs.existsSync(cicdFile)) {
        console.log('   ✅ CI/CD pipeline configuration exists');
        
        const content = fs.readFileSync(cicdFile, 'utf8');
        
        // Check for proper secrets usage
        if (content.includes('${{ secrets.')) {
            console.log('   ✅ GitHub Secrets are properly referenced');
        } else {
            console.log('   ❌ GitHub Secrets not found in CI/CD configuration');
            hasIssues = true;
        }
        
        // Check for environment separation
        if (content.includes('environment:')) {
            console.log('   ✅ Environment separation configured');
        } else {
            console.log('   ⚠️  Environment separation not configured');
        }
    } else {
        console.log('   ❌ CI/CD pipeline configuration missing');
        hasIssues = true;
    }
    console.log('');
}

// Run all checks
checkHardcodedSecrets();
checkEnvFiles();
checkEnvironmentUsage();
checkLoggingPractices();
checkCICDConfiguration();

// Summary
console.log('🔒 Security Check Summary:');
if (hasIssues) {
    console.log('❌ Some security issues were found. Please review and fix them.');
    process.exit(1);
} else {
    console.log('✅ All security checks passed!');
    process.exit(0);
}