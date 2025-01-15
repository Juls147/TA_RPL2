const prisma = require("../models/prisma");
const tf = require("@tensorflow/tfjs");

let cachedUserProductMatrix = null;
let cachedModel = null;

async function getUserProductMatrix() {
  if (cachedUserProductMatrix) {
    return cachedUserProductMatrix;
  }

  try {
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: true,
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!orderItems.length) {
      console.error("No order items found in the database.");
      throw new Error("No order items found in the database.");
    }

    const productQuantityMap = {};

    orderItems.forEach((item) => {
      const productId = item.productId;
      const quantity = item.quantity;

      if (!productQuantityMap[productId]) {
        productQuantityMap[productId] = 0;
      }
      productQuantityMap[productId] += quantity;
    });

    const products = Object.entries(productQuantityMap).map(
      ([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity: quantity,
      })
    );

    products.sort((a, b) => b.quantity - a.quantity);

    const numProducts = products.length;
    const userProductMatrix = tf.buffer([1, numProducts]);

    products.forEach((product, index) => {
      userProductMatrix.set(product.quantity, 0, index);
    });

    cachedUserProductMatrix = {
      userProductMatrix: userProductMatrix.toTensor(),
      productQuantityMap,
    };

    return cachedUserProductMatrix;
  } catch (error) {
    console.error("Error in getUserProductMatrix:", error.message);
    throw error;
  }
}

async function trainModel() {
  if (cachedModel) {
    return cachedModel;
  }

  try {
    const { userProductMatrix } = await getUserProductMatrix();

    if (userProductMatrix.size === 0) {
      console.error("UserProductMatrix is empty.");
      throw new Error("UserProductMatrix is empty.");
    }

    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: 64,
        activation: "relu",
        inputShape: [userProductMatrix.shape[1]],
      })
    );
    model.add(
      tf.layers.dense({
        units: userProductMatrix.shape[1],
        activation: "softmax",
      })
    );

    model.compile({
      optimizer: tf.train.adam(),
      loss: "meanSquaredError",
    });

    await model.fit(userProductMatrix, userProductMatrix, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2,
    });

    cachedModel = model;

    return cachedModel;
  } catch (error) {
    console.error("Error in trainModel:", error.message);
    throw error;
  }
}

async function recommendProducts() {
  try {
    const { userProductMatrix, productQuantityMap } =
      await getUserProductMatrix();

    const model = await trainModel();

    const prediction = model.predict(userProductMatrix).arraySync()[0];

    const recommendedProductIndices = prediction
      .map((score, index) => ({ index, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ index }) => index);

    const recommendedProductIds = recommendedProductIndices.map((index) =>
      parseInt(Object.keys(productQuantityMap)[index])
    );

    const recommendations = recommendedProductIds.map((productId) => ({
      productId,
      quantity: productQuantityMap[productId],
    }));

    return recommendations;
  } catch (error) {
    console.error("Error in recommendProducts:", error.message);
    throw error;
  }
}

async function saveRecommendations(recommendations) {
  recommendations = recommendations.slice(0, 5);

  try {
    await prisma.recommendProduct.deleteMany();

    const data = recommendations.map((recommendation) => ({
      productId: recommendation.productId,
    }));

    await prisma.recommendProduct.createMany({
      data: data,
    });

    console.log("Recommendations saved successfully.");
  } catch (error) {
    console.error("Error saving recommendations:", error.message);
    throw error;
  }
}

module.exports = { recommendProducts, saveRecommendations };
