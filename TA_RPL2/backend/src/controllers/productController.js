const prisma = require("../models/prisma");
const fs = require("fs");
const path = require("path");

exports.getAllProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: {
        id: "asc",
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: {
        sold: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductByIdCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      include: { category: true },
      orderBy: {
        id: "asc",
      },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this category" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const name = req.params.name;

    const product = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: { category: true },
    });

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query, category } = req.query;

    let whereClause = {
      name: {
        contains: query,
        mode: "insensitive",
      },
    };

    if (category) {
      whereClause.categoryId = parseInt(category);
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !price || !image || !stock || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new Error("Invalid price");
    }

    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock <= 0) {
      throw new Error("Invalid stock");
    }

    const categoryId = parseInt(category);
    if (isNaN(categoryId)) {
      throw new Error("Invalid category ID");
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        image: `/images/${image}`,
        stock: parsedStock,
        sold: 0,
        categoryId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
    };

    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        existingProduct.image
      );

      const newImagePath = `/images/${req.file.filename}`;

      updatedData.image = newImagePath;

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.recommendProduct.deleteMany({
      where: { productId: parseInt(id) },
    });

    await prisma.orderItem.deleteMany({
      where: { productId: parseInt(id) },
    });

    await prisma.cartItem.deleteMany({
      where: { productId: parseInt(id) },
    });

    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      product.image
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
