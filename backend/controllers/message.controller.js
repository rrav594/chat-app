import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // Socket IO functionality will be added here
    // await conversation.save();
    // await newMessage.save();

    // Both runs in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({
      status: "success",
      message: "Message sent succesfully.",
      data: { newMessage },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message || "Internal server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!conversation) {
      res.status(200).json({ status: "succes", data: [] });
    }

    const messages = conversation.messages;
    res.status(200).json({ status: "success", data: messages });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message || "Internal server error",
    });
  }
};
