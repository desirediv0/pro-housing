import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Test Admin System
async function testAdminSystem() {
    console.log('🚀 Testing Pro Housing Admin System\n');

    try {
        // 1. Create Admin Account
        console.log('1. Creating Admin Account...');
        const createResponse = await axios.post(`${API_BASE}/admin/create`, {
            name: 'Super Admin',
            email: 'admin@prohousing.com',
            password: 'AdminPass123!'
        });
        console.log('✅ Admin created:', createResponse.data.message);

        // 2. Login Admin
        console.log('\n2. Logging in Admin...');
        const loginResponse = await axios.post(`${API_BASE}/admin/login`, {
            email: 'admin@prohousing.com',
            password: 'AdminPass123!'
        });
        console.log('✅ Admin logged in:', loginResponse.data.message);

        const token = loginResponse.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 3. Get Admin Profile
        console.log('\n3. Getting Admin Profile...');
        const profileResponse = await axios.get(`${API_BASE}/admin/profile`, { headers });
        console.log('✅ Profile retrieved:', profileResponse.data.data.name);

        // 4. Get All Properties (empty initially)
        console.log('\n4. Getting All Properties...');
        const propertiesResponse = await axios.get(`${API_BASE}/properties/all`, { headers });
        console.log('✅ Properties retrieved:', propertiesResponse.data.data.properties.length, 'properties found');

        // 5. Health Check
        console.log('\n5. Health Check...');
        const healthResponse = await axios.get(`${API_BASE}/health`);
        console.log('✅ Server is healthy:', healthResponse.data.message);

        console.log('\n🎉 All tests passed! Admin system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
    }
}

// Run tests if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname.replace(/^\/[A-Z]:/, '')) {
    testAdminSystem();
}

export { testAdminSystem };
