import { Router } from "express";
import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createUser, deleteManyUser, getAllUser, getUniqueUser } from "./controller/UserController";
import { createStore, getAllStore } from "./controller/StoreController";
import { createProduct, deleteProductes, getAllProductes, getUniqueProductes, updateProduct } from "./controller/ProductController";
import {signIn} from "./controller/SessionController"
import { authMiddleware } from "./middlewares/AuthMiddlewares";
import { createSale, getAllSales, getAllSalesByBuyer, getAllSalesBySeller } from "./controller/SaleController";

export const router = Router()

router.post("/user", createUser)
router.delete("/delete-users",authMiddleware(["adm"]), deleteManyUser)
router.get("/get-all-user", authMiddleware(["adm"]), getAllUser)
router.get("/get-unique-user", authMiddleware(["adm", "vendedor", "comprador"]), getUniqueUser)

router.post("/access", authMiddleware(["adm"]), createAccess)
router.get("/accesses", authMiddleware(["comprador"]), getAllAccesses)

router.post("/store", authMiddleware(["adm", "vendedor"]), createStore)
router.get("/stores", getAllStore)

router.post("/product/:storeId", authMiddleware(["vendedor","adm"]), createProduct)
router.get("/getAllProduct", getAllProductes)
router.put("/update-product/:productId", authMiddleware(["vendedor","adm"]), updateProduct)
router.get("/find-unique-product/:productId", authMiddleware(["vendedor","adm", "comprador"]), getUniqueProductes)
router.delete("/delete-product/:productId",authMiddleware(["adm", "vendedor", ]), deleteProductes)

router.post("/sign-in", signIn)

router.post("/create-sale", authMiddleware(["adm", "vendedor", "comprador"]), createSale)
router.get("/get-all-sales", authMiddleware(["adm"]), getAllSales)
router.get("/get-all-sales-by-buyer", authMiddleware(["adm","comprador"]), getAllSalesByBuyer)
router.get("/get-all-sales-by-seller", authMiddleware(["adm","vendedor"]), getAllSalesBySeller)