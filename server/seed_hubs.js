const mongoose = require("mongoose");
const Chat = require("./model/Chat");
const User = require("./model/Users");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI_LOCAL;

async function seedHubs() {
  try {
    await mongoose.connect(mongoUri);
    const user = await User.findOne();
    if (!user) {
      console.error("No user found.");
      process.exit(1);
    }

    const hubs = [
      {
        chatName: "Kathmandu Safety Hub",
        isGroupChat: true,
        users: [user._id],
        groupAdmin: user._id,
        coordinates: [27.7172, 85.3240] // Lat, Lng
      },
      {
        chatName: "Pokhara Basecamp",
        isGroupChat: true,
        users: [user._id],
        groupAdmin: user._id,
        coordinates: [28.2096, 83.9856]
      },
      {
        chatName: "Lukla High-Alt Hub",
        isGroupChat: true,
        users: [user._id],
        groupAdmin: user._id,
        coordinates: [27.6859, 86.7314]
      }
    ];

    for (const hub of hubs) {
      const existing = await Chat.findOne({ chatName: hub.chatName });
      if (!existing) {
        await Chat.create(hub);
        console.log(`Created Hub: ${hub.chatName}`);
      }
    }

    console.log("Hub seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedHubs();
