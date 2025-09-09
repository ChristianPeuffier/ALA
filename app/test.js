const request = require('supertest');
const app = require('./server');

console.log('🧪 Running ALA Secrets Demo Tests...\n');

async function runTests() {
    let testsPassed = 0;
    let testsTotal = 0;

    // Test 1: Health check endpoint
    testsTotal++;
    try {
        const response = await request(app).get('/health');
        if (response.status === 200 && response.body.status === 'OK') {
            console.log('✅ Test 1: Health check endpoint works');
            testsPassed++;
        } else {
            console.log('❌ Test 1: Health check endpoint failed');
        }
    } catch (error) {
        console.log('❌ Test 1: Health check endpoint error:', error.message);
    }

    // Test 2: Status endpoint doesn't expose secrets
    testsTotal++;
    try {
        const response = await request(app).get('/api/status');
        const responseString = JSON.stringify(response.body);
        
        if (response.status === 200 && 
            !responseString.includes(process.env.DB_PASSWORD || '') &&
            !responseString.includes(process.env.API_KEY || '') &&
            !responseString.includes(process.env.JWT_SECRET || '')) {
            console.log('✅ Test 2: Status endpoint doesn\'t expose secrets');
            testsPassed++;
        } else {
            console.log('❌ Test 2: Status endpoint may expose secrets');
        }
    } catch (error) {
        console.log('❌ Test 2: Status endpoint error:', error.message);
    }

    // Test 3: Config endpoint is secure
    testsTotal++;
    try {
        const response = await request(app).get('/api/config');
        const responseString = JSON.stringify(response.body);
        
        if (response.status === 200 && 
            !responseString.includes(process.env.DB_PASSWORD || '') &&
            !responseString.includes(process.env.API_KEY || '') &&
            !responseString.includes(process.env.JWT_SECRET || '')) {
            console.log('✅ Test 3: Config endpoint is secure');
            testsPassed++;
        } else {
            console.log('❌ Test 3: Config endpoint may expose secrets');
        }
    } catch (error) {
        console.log('❌ Test 3: Config endpoint error:', error.message);
    }

    // Test 4: Insecure example has warning
    testsTotal++;
    try {
        const response = await request(app).get('/api/insecure-example');
        
        if (response.status === 200 && 
            response.body.warning && 
            response.body.warning.includes('INSECURE')) {
            console.log('✅ Test 4: Insecure example has proper warning');
            testsPassed++;
        } else {
            console.log('❌ Test 4: Insecure example missing warning');
        }
    } catch (error) {
        console.log('❌ Test 4: Insecure example error:', error.message);
    }

    // Summary
    console.log(`\n🏁 Test Results: ${testsPassed}/${testsTotal} tests passed`);
    
    if (testsPassed === testsTotal) {
        console.log('🎉 All tests passed!');
        process.exit(0);
    } else {
        console.log('💥 Some tests failed!');
        process.exit(1);
    }
}

// Handle server cleanup
process.on('exit', () => {
    console.log('🛑 Tests completed');
});

runTests().catch(error => {
    console.error('💥 Test runner error:', error);
    process.exit(1);
});