const prisma = require("../models/prisma");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      const item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
      return res.status(201).json(item);
    } else {
      const item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
      return res.status(201).json(item);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  const { id, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  try {
    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
    res.json(updatedCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedCartItem = await prisma.cartItem.delete({
      where: { id },
    });
    res.json(deletedCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
