const Chat = require("../model/Chat");
const User = require("../model/Users");

exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).json({ success: false, message: "UserId not provided" });
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name profileUrl email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name profileUrl email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);
  const { coordinates, name } = req.body;

  if (users.length < 1) {
    return res
      .status(400)
      .send("At least one user is required to form a network cluster");
  }

  // Check if a hub already exists at these coordinates and is not full
  if (coordinates && Array.isArray(coordinates)) {
    try {
      const existingHub = await Chat.findOne({
        isGroupChat: true,
        coordinates: { $all: coordinates },
        $expr: { $lt: [{ $size: "$users" }, 20] }
      });

      if (existingHub) {
        // If already a member, just return it
        if (!existingHub.users.includes(req.user.id)) {
          existingHub.users.push(req.user.id);
          await existingHub.save();
        }
        
        const fullHub = await Chat.findOne({ _id: existingHub._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
          
        return res.status(200).json(fullHub);
      }
    } catch (err) {
      console.error("Cluster lookup error:", err);
    }
  }

  users.push(req.user.id);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
      coordinates: coordinates,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).json({ success: false, message: "Chat Not Found" });
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404).json({ success: false, message: "Chat Not Found" });
    } else {
      res.json(removed);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).json({ success: false, message: "Chat Not Found" });
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteChat = async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await Chat.findByIdAndDelete(id);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
