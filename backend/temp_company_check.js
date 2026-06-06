require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ email: 'e2e.company7980@example.com' }).lean();
    if (!user) {
      console.log('user not found');
      process.exit(0);
    }
    const companies = await Company.find({ userId: user._id }).lean();
    console.log('user', { email: user.email, id: user._id.toString() });
    console.log('companies', companies.map(c => ({ companyName: c.companyName, role: c.role, applicationDate: c.applicationDate.toISOString().slice(0,10), notes: c.notes, oaStatus: c.oaStatus, technicalRound1Status: c.technicalRound1Status, technicalRound2Status: c.technicalRound2Status, hrRoundStatus: c.hrRoundStatus })));
  } catch (err) {
    console.error('error', err);
  } finally {
    await mongoose.disconnect();
  }
})();
