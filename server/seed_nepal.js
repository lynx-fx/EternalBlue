const mongoose = require("mongoose");
const Scam = require("./model/Scam");
const User = require("./model/Users");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI_LOCAL;

const nepalScams = [
  {
    country: "nepal",
    title: "Pashupatinath 'Blessed' Thread Scam",
    description: "Self-proclaimed priests or sadhus may forcefully put a colored thread around your wrist near Pashupatinath temple and then demand a high 'donation' (often 500-1000 NPR) for the 'blessing'. Best to politely decline before they touch your wrist.",
    severity: "High"
  },
  {
    country: "nepal",
    title: "Overpriced Taxi from Tribhuvan Airport",
    description: "Drivers inside the airport terminal or just outside often quote triple the standard local rate to tourists. Use the official 'Pre-paid Taxi' counter or install the local 'Pathao' app to get fair, fixed pricing.",
    severity: "Medium"
  },
  {
    country: "nepal",
    title: "Fake 'Student' Guide in Thamel",
    description: "Young individuals in Thamel may approach you claiming to be students wanting to practice English. They eventually lead you to a 'family workshop' or school where they pressure you to buy overpriced art or donate large sums for their education.",
    severity: "Low"
  },
  {
    country: "nepal",
    title: "Tea Shop 'Commission' Markup",
    description: "On trekking routes like EBC or ABC, some unlicensed guides may steer you toward specific tea houses where they receive a kickback, resulting in higher room and food prices for you. Always cross-check menu prices.",
    severity: "Medium"
  },
  {
    country: "nepal",
    title: "Lukla Helicopter Urgency Scam",
    description: "During flight cancellations due to weather in Lukla, unofficial agents may create fake urgency, claiming helicopters are 'almost full' to charge desperate trekkers $500-$800 for seats that normally cost much less.",
    severity: "High"
  }
];

async function seedNepal() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Find an existing admin or user to associate these with
    const user = await User.findOne();
    if (!user) {
      console.error("No user found in database. Please register a user first.");
      process.exit(1);
    }

    // Clear existing Nepal scams if any (optional, but good for clean state)
    // await Scam.deleteMany({ country: "nepal" });

    const scamsWithUser = nepalScams.map(scam => ({
      ...scam,
      createdBy: user._id
    }));

    await Scam.insertMany(scamsWithUser);
    console.log(`Successfully seeded ${nepalScams.length} Nepal-specific travel alerts.`);
    
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedNepal();
