const prisma = require("../models/prisma");
const {
  recommendProducts,
  saveRecommendations,
} = require("../recommend/recommendService");

exports.getAllRecommendProducts = async (req, res) => {
  try {
    const recommendProducts = await prisma.recommendProduct.findMany({
      take: 5,
      include: {
        product: {
          select: {
            name: true,
            image: true,
            price: true,
            stock: true,
            description: true,
            sold: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const simplifiedRecommendations = recommendProducts.map(
      (recommendation) => ({
        id: recommendation.id,
        name: recommendation.product.name,
        image: recommendation.product.image,
        price: recommendation.product.price,
        stock: recommendation.product.stock,
        description: recommendation.product.description,
        sold: recommendation.product.sold,
        category: recommendation.product.category.name,
      })
    );

    res.json(simplifiedRecommendations);
  } catch (error) {
    console.error("Error in getAllRecommendProducts:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommend = async (req, res) => {
  try {
    console.log("Fetching recommendations...");
    const recommendations = await recommendProducts();
    console.log("Recommendations fetched:", recommendations);

    await saveRecommendations(recommendations);
    console.log("Recommendations saved successfully.");

    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
