/**
 * Database Check Script
 * Checks MongoDB for job sources and salary data
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Job Schema (simplified version)
const jobSchema = new mongoose.Schema({
  remoteId: String,
  title: String,
  company: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  sourceApi: String,
  isActive: Boolean,
  postedAt: Date
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Total jobs count
    const totalJobs = await Job.countDocuments({ isActive: true });
    console.log(`📊 Total Active Jobs: ${totalJobs}\n`);

    // 2. Jobs by source API
    console.log('📍 Jobs by Source API:');
    const sourceBreakdown = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$sourceApi', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    sourceBreakdown.forEach(source => {
      console.log(`   - ${source._id || 'Unknown'}: ${source.count} jobs`);
    });
    console.log('');

    // 3. Check salary data availability by source
    console.log('💰 Salary Data Availability:');

    for (const source of sourceBreakdown) {
      const sourceName = source._id || 'Unknown';

      // Jobs with salary data (min OR max populated)
      const jobsWithSalary = await Job.countDocuments({
        isActive: true,
        sourceApi: sourceName,
        $or: [
          { 'salary.min': { $ne: null, $exists: true } },
          { 'salary.max': { $ne: null, $exists: true } }
        ]
      });

      // Jobs with both min and max
      const jobsWithFullSalary = await Job.countDocuments({
        isActive: true,
        sourceApi: sourceName,
        'salary.min': { $ne: null, $exists: true },
        'salary.max': { $ne: null, $exists: true }
      });

      const percentage = ((jobsWithSalary / source.count) * 100).toFixed(1);
      const fullPercentage = ((jobsWithFullSalary / source.count) * 100).toFixed(1);

      console.log(`   ${sourceName}:`);
      console.log(`      Total: ${source.count} jobs`);
      console.log(`      With salary (min OR max): ${jobsWithSalary} (${percentage}%)`);
      console.log(`      With full range (min AND max): ${jobsWithFullSalary} (${fullPercentage}%)`);
    }
    console.log('');

    // 4. Sample jobs with salary from each source
    console.log('💵 Sample Jobs WITH Salary Data:');
    for (const source of sourceBreakdown) {
      const sourceName = source._id || 'Unknown';

      const sampleWithSalary = await Job.findOne({
        isActive: true,
        sourceApi: sourceName,
        $or: [
          { 'salary.min': { $ne: null, $exists: true } },
          { 'salary.max': { $ne: null, $exists: true } }
        ]
      }).select('title company salary sourceApi').lean();

      if (sampleWithSalary) {
        console.log(`   ${sourceName}: ${sampleWithSalary.title} at ${sampleWithSalary.company}`);
        console.log(`      Salary: ${sampleWithSalary.salary?.currency || 'USD'} ${sampleWithSalary.salary?.min || 'N/A'} - ${sampleWithSalary.salary?.max || 'N/A'}`);
      } else {
        console.log(`   ${sourceName}: No jobs with salary data found ❌`);
      }
    }
    console.log('');

    // 5. Sample jobs WITHOUT salary
    console.log('❌ Sample Jobs WITHOUT Salary Data:');
    for (const source of sourceBreakdown.slice(0, 3)) {  // Just show first 3 sources
      const sourceName = source._id || 'Unknown';

      const sampleWithoutSalary = await Job.findOne({
        isActive: true,
        sourceApi: sourceName,
        $and: [
          { $or: [{ 'salary.min': null }, { 'salary.min': { $exists: false } }] },
          { $or: [{ 'salary.max': null }, { 'salary.max': { $exists: false } }] }
        ]
      }).select('title company salary sourceApi').lean();

      if (sampleWithoutSalary) {
        console.log(`   ${sourceName}: ${sampleWithoutSalary.title} at ${sampleWithoutSalary.company}`);
        console.log(`      Salary: ${JSON.stringify(sampleWithoutSalary.salary)}`);
      }
    }
    console.log('');

    // 6. Recent jobs (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentJobs = await Job.countDocuments({
      isActive: true,
      postedAt: { $gte: weekAgo }
    });

    console.log(`📅 Recent Jobs (Last 7 days): ${recentJobs}`);

    console.log('\n✅ Database check complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

checkDatabase();
