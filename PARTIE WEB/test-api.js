const testAPI = async () => {
  console.log('=== Test API AI ===\n');

  // 1. Register a test user
  console.log('1. Registering test user...');
  try {
    const regRes = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testai@loeni.com',
        password: 'testpass123',
        role: 'admin',
        displayName: 'TestAI'
      })
    });
    const regData = await regRes.json();
    console.log('   Register:', regData);
  } catch (e) {
    console.log('   Register error:', e.message);
  }

  // 2. Login
  console.log('\n2. Logging in...');
  try {
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testai@loeni.com',
        password: 'testpass123'
      })
    });
    const loginData = await loginRes.json();
    console.log('   Login:', JSON.stringify(loginData).substring(0, 200));
    
    if (loginData.token) {
      const token = loginData.token;
      
      // 3. Get rooms
      console.log('\n3. Getting rooms...');
      const roomsRes = await fetch('http://localhost:4000/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rooms = await roomsRes.json();
      console.log('   Rooms count:', Array.isArray(rooms) ? rooms.length : 'error');
      
      if (Array.isArray(rooms) && rooms.length > 0) {
        const roomId = rooms[0]._id || rooms[0].id;
        console.log('   First room:', rooms[0].name || rooms[0].roomName, '- ID:', roomId);
        
        // 4. Test AI Analysis
        console.log('\n4. Testing AI Analysis...');
        const aiRes = await fetch('http://localhost:4000/api/ai/room-risk', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ roomId })
        });
        const aiData = await aiRes.json();
        console.log('   AI Result:', JSON.stringify(aiData, null, 2));
      }
    }
  } catch (e) {
    console.log('   Login error:', e.message);
  }
  
  console.log('\n=== Test Complete ===');
};

testAPI();
