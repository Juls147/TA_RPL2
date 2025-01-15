const prisma = require("../models/prisma");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const selectedItems = req.body.items;

    if (!selectedItems || selectedItems.length === 0) {
      return res.status(400).json({ error: "No items selected" });
    }

    for (const item of selectedItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found: ${item.productId}` });
      }

      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product: ${product.name}` });
      }
    }

    for (const item of selectedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const total = selectedItems.reduce((sum, item) => {
      if (!item.product || !item.product.price) {
        throw new Error("Product price not found");
      }
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        orderItems: {
          create: selectedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { orderItems: true },
    });

    await prisma.cartItem.deleteMany({
      where: {
        id: { in: selectedItems.map((item) => item.id) },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { orderItems: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const order = await prisma.order.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.orderItem.deleteMany({
      where: { orderId: parseInt(id) },
    });

    await prisma.order.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
