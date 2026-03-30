import { Router } from "express";
import { ProductModel } from "../models/products.model.js";

const router = Router();

// GET productos con filtros, paginación y ordenamiento
router.get("/", async (req, res) => {

  try {

    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    // filtro
    let filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    // ordenamiento
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      page,
      limit,
      sort: sortOption,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    const baseUrl = "http://localhost:8080/api/products";

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?page=${result.nextPage}&limit=${limit}`
        : null
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      error: "Error obteniendo productos"
    });

  }

});

// obtener producto por id
router.get("/:pid", async (req, res) => {

  try {

    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({ error: "Error obteniendo producto" });

  }

});

// crear producto
router.post("/", async (req, res) => {

  try {

    const product = await ProductModel.create(req.body);

    res.json(product);

  } catch (error) {

    res.status(500).json({ error: "Error creando producto" });

  }

});

// actualizar producto
router.put("/:pid", async (req, res) => {

  try {

    const product = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (error) {

    res.status(500).json({ error: "Error actualizando producto" });

  }

});

// eliminar producto
router.delete("/:pid", async (req, res) => {

  try {

    await ProductModel.findByIdAndDelete(req.params.pid);

    res.json({ message: "Producto eliminado" });

  } catch (error) {

    res.status(500).json({ error: "Error eliminando producto" });

  }

});

export default router;