const prisma = require("../models/prisma");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const categoryToUpdate = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!categoryToUpdate) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productsToDelete = await prisma.product.findMany({
      where: { categoryId: parseInt(id) },
      select: { id: true },
    });

    const productIds = productsToDelete.map((product) => product.id);

    await prisma.recommendProduct.deleteMany({
      where: {
        productId: {
          in: productIds,
        },
      },
    });

    await prisma.product.deleteMany({
      where: { categoryId: parseInt(id) },
    });

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
