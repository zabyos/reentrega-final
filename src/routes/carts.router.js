import { Router } from "express"
import { CartModel } from "../models/carts.model.js"

const router = Router()

// crear carrito
router.post("/", async (req,res,next)=>{
  try{
    const cart = await CartModel.create({products:[]})
    res.json(cart)
  }catch(error){
    next(error)
  }
})

// obtener carrito
router.get("/:cid", async (req,res,next)=>{
  try{

    const cart = await CartModel
      .findById(req.params.cid)
      .populate("products.product")

    if(!cart){
      return res.status(404).json({error:"Carrito no encontrado"})
    }

    // limpiar productos null
    cart.products = cart.products.filter(p => p.product !== null)
    await cart.save()

    res.json(cart)

  }catch(error){
    next(error)
  }
})

// agregar producto
router.post("/:cid/products/:pid", async (req,res,next)=>{
  try{

    const cart = await CartModel.findById(req.params.cid)

    if(!cart){
      return res.status(404).json({error:"Carrito no encontrado"})
    }

    const existing = cart.products.find(
      p => p.product.toString() === req.params.pid
    )

    if(existing){
      existing.quantity++
    }else{
      cart.products.push({
        product:req.params.pid,
        quantity:1
      })
    }

    await cart.save()

    res.json(cart)

  }catch(error){
    next(error)
  }
})

// eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req,res,next)=>{
  try{

    const cart = await CartModel.findById(req.params.cid)

    if(!cart){
      return res.status(404).json({error:"Carrito no encontrado"})
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== req.params.pid
    )

    await cart.save()

    res.json(cart)

  }catch(error){
    next(error)
  }
})

// actualizar todo el carrito
router.put("/:cid", async (req,res,next)=>{
  try{

    const cart = await CartModel.findByIdAndUpdate(
      req.params.cid,
      {products:req.body.products},
      {new:true}
    )

    res.json(cart)

  }catch(error){
    next(error)
  }
})

// actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req,res,next)=>{
  try{

    const cart = await CartModel.findById(req.params.cid)

    if(!cart){
      return res.status(404).json({error:"Carrito no encontrado"})
    }

    const product = cart.products.find(
      p => p.product.toString() === req.params.pid
    )

    if(!product){
      return res.status(404).json({error:"Producto no encontrado"})
    }

    product.quantity = req.body.quantity

    await cart.save()

    res.json(cart)

  }catch(error){
    next(error)
  }
})

// vaciar carrito
router.delete("/:cid", async (req,res,next)=>{
  try{

    const cart = await CartModel.findById(req.params.cid)

    if(!cart){
      return res.status(404).json({error:"Carrito no encontrado"})
    }

    cart.products = []

    await cart.save()

    res.json({message:"Carrito vaciado"})

  }catch(error){
    next(error)
  }
})

export default router
