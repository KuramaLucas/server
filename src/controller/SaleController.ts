import { Request, Response } from "express"
import { prisma } from "../database/prisma"

export const createSale = async (req: Request, res: Response) => {
    const { products, userSellerId } = req.body
    const { id } = req.user;

    try {
        const productByDatabase = await prisma.product.findMany({
            where: {
                id: { in: products.map((product: any) => product.id) },
            },
        });

        const productWithQuantity = productByDatabase.map((product) => {
            const {id, name, price} = product;
            const quantity = products.find((p:any) => p.id == product.id).quantity
            return{
                id,
                name,
                price,
                quantity,
            };
        });

        let total=0
        for(const product of productWithQuantity){
            total += product.price * parseInt(product.quantity)
        }
            
        if(id == userSellerId){
            return res.status(400).json({message: "não é possivel criar uma venda com o id do comprador e vendedor iguais "})
        }

        const sale = await prisma.sale.create({
            data: {
                total_value: total,
                Seller: {connect: {id: userSellerId}},
                Buyer: {connect: {id}}, 
                SaleProduct:{
                    create: productWithQuantity.map((product) =>({
                        Product:{connect: {id: product.id}},
                        quantity: product.quantity,
                    })),
                },
            },
            include: {
                SaleProduct: true,
            },
        });

        productWithQuantity.map(async (product)=>{
            await prisma.product.updateMany({
                where:{id: product.id},
                data:{
                    amount:{
                        decrement: parseInt(product.quantity),
                    },
                },
            });
        });

        return res.status(201).json({sale, message: "compra realizada com sucesso"})

    } catch (error) {
        console.error("Erro ao criar venda:", error);
        return res.status(500).json({ message: "Erro ao processar a venda", error });

    }
}

export const getAllSales = async (req: Request, res: Response) =>{
    const sales = await prisma.sale.findMany({
        select: {
            id: true,
            total_value: true,
            Seller:{
                select:{
                    id: true,
                    name: true,
                }
            },
            Buyer:{
                select:{
                    id: true,
                    name: true,
                },
            },
            SaleProduct:{
                select:{
                    Product:{
                        select:{
                            id:true,
                            name: true,
                            price: true,
                            created_at: true,
                        }
                    },
                    quantity: true,
                    
                },
            },
        },
    });

    return res.status(200).json(sales);
} 

export const getAllSalesByBuyer = async (req: Request, res: Response) =>{
    const {id} = req.user
    const sales = await prisma.sale.findMany({
        where:{
          buyerId:id,  
        },
        select: {
            id: true,
            total_value: true,
            Seller:{
                select:{
                    id: true,
                    name: true,
                }
            },
            Buyer:{
                select:{
                    id: true,
                    name: true,
                },
            },
            SaleProduct:{
                select:{
                    Product:{
                        select:{
                            id:true,
                            name: true,
                            price: true,
                            created_at: true,
                        }
                    },
                    quantity: true,
                    
                },
            },
        },
    });

    return res.status(200).json(sales);
} 

export const getAllSalesBySeller = async (req: Request, res: Response) =>{
    const {id} = req.user
    const sales = await prisma.sale.findMany({
        where:{
          sellerId:id,  
        },
        select: {
            id: true,
            total_value: true,
            Seller:{
                select:{
                    id: true,
                    name: true,
                }
            },
            Buyer:{
                select:{
                    id: true,
                    name: true,
                },
            },
            SaleProduct:{
                select:{
                    Product:{
                        select:{
                            id:true,
                            name: true,
                            price: true,
                            created_at: true,
                        }
                    },
                    quantity: true,
                    
                },
            },
        },
    });

    return res.status(200).json(sales);
} 