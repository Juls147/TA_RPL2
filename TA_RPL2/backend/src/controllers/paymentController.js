const midtransClient = require("midtrans-client");
const prisma = require("../models/prisma");

const midtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findFirst({
      where: { id: parseInt(orderId) },
      include: {
        user: true,
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemDetails = order.orderItems.map((item) => ({
      id: item.product.id.toString(),
      price: item.product.price,
      quantity: item.quantity,
      name: item.product.name,
    }));

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: order.total,
      },
      item_details: itemDetails,
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: order.user.email,
        phone: order.user.no_hp,
      },
    };

    const transaction = await midtrans.createTransaction(parameter);

    const redirectUrl = transaction.redirect_url;

    res.json({ redirect_url: redirectUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
