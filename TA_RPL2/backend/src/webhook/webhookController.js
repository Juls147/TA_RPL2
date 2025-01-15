const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleWebhook = async (req, res) => {
  let { order_id, transaction_status, gross_amount, payment_type } = req.body;

  order_id = parseInt(order_id);

  try {
    const order = await prisma.order.findFirst({
      where: { id: order_id },
      include: {
        user: true,
        orderItems: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (transaction_status === "settlement") {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "PAID" },
      });

      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sold: {
              increment: item.quantity,
            },
          },
        });
      }

      await prisma.message.create({
        data: {
          title: "Pembayaran Berhasil",
          description: `Pembayaran Anda sebesar ${gross_amount} menggunakan ${payment_type} telah berhasil diproses. Barang yang Anda beli akan segera dikirim.`,
          receivedAt: new Date(),
          userId: order.userId,
        },
      });
    } else if (transaction_status === "pending") {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "PENDING" },
      });

      await prisma.message.create({
        data: {
          title: "Pembayaran Tertunda",
          description: `Pembayaran Anda sebesar ${gross_amount} menggunakan ${payment_type} Tertunda.`,
          userId: order.userId,
        },
      });
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "FAILED" },
      });

      await prisma.message.create({
        data: {
          title: "Payment Gagal",
          description: `Pembayaran Anda sebesar ${gross_amount} menggunakan ${payment_type} telah gagal. Silahkan coba lagi.`,
          userId: order.userId,
        },
      });
    }

    res.status(200).json({ message: "Webhook handled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleWebhook };
