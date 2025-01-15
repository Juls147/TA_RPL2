const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        userType: "user",
      },
    });

    await prisma.message.create({
      data: {
        title: "Daftar Berhasil",
        description: `Anda berhasil mendaftarkan akun dengan username: ${username}.`,
        receivedAt: new Date(),
        userId: user.id,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await prisma.message.create({
      data: {
        title: "Login Berhasil",
        description: `Anda berhasil login ke akun dengan username: ${username}.`,
        receivedAt: new Date(),
        userId: user.id,
      },
    });

    res.json({ token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, no_hp, location, password, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        no_hp,
        location,
        password: hashedPassword,
        userType,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        no_hp: true,
        location: true,
        password: true,
        userType: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserType = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { userType: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.send(user.userType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, no_hp, location, password, userType } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let hashedPassword;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const dataToUpdate = { username, email, no_hp, location };
    if (hashedPassword) {
      dataToUpdate.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.message.deleteMany({
      where: { userId: Number(id) },
    });

    await prisma.orderItem.deleteMany({
      where: {
        order: {
          userId: Number(id),
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        userId: Number(id),
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: Number(id),
        },
      },
    });

    await prisma.cart.deleteMany({
      where: {
        userId: Number(id),
      },
    });

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
