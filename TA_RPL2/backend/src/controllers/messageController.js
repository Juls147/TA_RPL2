const prisma = require("../models/prisma");

exports.createMessage = async (req, res) => {
  try {
    const { title, userId } = req.body;

    let description = "";
    if (title.toLowerCase() === "booking") {
      description = "Pesanan Anda telah diterima dan sedang diproses.";
    } else if (title.toLowerCase() === "pengembalian barang") {
      description = "Pengajuan pengembalian barang Anda sedang diproses.";
    } else if (title.toLowerCase() === "Barang Tiba") {
      description = "Barang sudah sampai dan berhasil diterima.";
    } else {
      description = "Pesan umum dari sistem.";
    }

    const message = await prisma.message.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: { username: true },
        },
      },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessageByName = async (req, res) => {
  try {
    const { username } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        user: {
          username: username,
        },
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.message.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMessageByName = async (req, res) => {
  try {
    const { username } = req.user;

    const deleteResult = await prisma.message.deleteMany({
      where: {
        user: {
          username: username,
        },
      },
    });

    res.json({
      message: `Deleted ${deleteResult.count} messages for ${username}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createArrivedMessage = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        user: true,
        orderItems: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const message = await prisma.message.create({
      data: {
        title: "Barang Tiba",
        description: `Barang anda dengan order ID ${order.id} sudah sampai dan berhasil diterima.`,
        receivedAt: new Date(),
        userId: order.userId,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
