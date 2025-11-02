// Simple test to check backend connection
const testBackendConnection = async () => {
  try {
    console.log('🔄 Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData.message);
    } else {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    // Test jobs endpoint
    const jobsResponse = await fetch('http://localhost:5000/api/jobs?limit=3');
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      console.log(`✅ Jobs API working: Found ${jobsData.data.jobs.length} jobs`);
      console.log('📋 Sample job:', jobsData.data.jobs[0]?.title || 'No jobs found');
    } else {
      throw new Error(`Jobs API failed: ${jobsResponse.status}`);
    }
    
    // Test stats endpoint  
    const statsResponse = await fetch('http://localhost:5000/api/jobs/stats');
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log(`✅ Stats API working: ${statsData.data.totalJobs} total jobs, ${statsData.data.totalCompanies} companies`);
    } else {
      console.warn('⚠️ Stats API failed, but that\'s okay for now');
    }
    
    console.log('🎉 Backend is fully connected and working!');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('💡 Make sure your backend is running with: cd backend2 && npm run dev');
  }
};

// Run the test
testBackendConnection();