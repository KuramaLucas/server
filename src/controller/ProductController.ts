import { Request, Response } from "express";
import { prisma } from "../database/prisma";


export const createProduct = async (req: Request, res: Response) => {
    const { name, price, amount } = req.body;
    const { storeId } = req.params

    const Product = await prisma.product.create({
        data: {
            name, price, amount, Store: {
                connect: {
                    id: storeId
                }
            }
        },
    })

    return res.json(Product);
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, amount } = req.body;
        const { productId } = req.params
        const { id } = req.user

        const isProduct = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            },

        })

        if (id != isProduct?.Store?.userId) {
            return res.status(404).json({ message: "Este produto nao pertence a este usuario" })
        }

        if (!isProduct) {
            return res.status(404).json({ message: "Product not found" })
        }



        const Product = await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                name, price, amount, Store: {

                }
            },
        })

        return res.status(200).json(Product);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllProductes = async (req: Request, res: Response) => {

    const Products = await prisma.product.findMany()

    return res.json(Products);
}

export const getUniqueProductes = async (req: Request, res: Response) => {
    try{
        const { productId } = req.params;
    const product = await prisma.product.findUnique({

        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            price: true,
            amount: true
        }
    });

    

    if(!product){
        return res.status(404).json({message: "product not found"})
    }

    return res.status(200).json(product);
    }catch(error){
    return res.status(400).json(error);
    }
}

export const deleteProductes = async (req: Request, res: Response) => {
    try{
        const { productId } = req.params
        const { id } = req.user

        const isProduct = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            },

        });

        if (!isProduct) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (id != isProduct?.Store?.userId) {
            return res.status(404).json({ message: "Este produto nao pertence a este usuario" })
        }

       

        await prisma.product.delete({
            where: {
                id: productId,
            },
        });

    return res.status(204).json({message: "produto deletado com sucesso"})
}catch(error){
    return res.status(400).json(error);
    }
}