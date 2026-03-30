import {Router} from "express"
import {ProductModel} from "../models/products.model.js"
import {CartModel} from "../models/carts.model.js"

const router = Router()

// vista productos
router.get("/products", async (req,res)=>{
  const products = await ProductModel.find().lean()
  res.render("products",{products})
})

// vista carrito
router.get("/carts/:cid", async (req,res)=>{
  const cart = await CartModel
    .findById(req.params.cid)
    .populate("products.product")
    .lean()

  res.render("cart",{cart})
})

// detalle producto
router.get("/products/:pid", async (req,res)=>{
  const product = await ProductModel
    .findById(req.params.pid)
    .lean()

  res.render("productDetail",{product})
})

export default router