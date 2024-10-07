import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { prisma } from "../database/prisma";

interface DecodedToken {
    userId: string;
}


export function authMiddleware(permissions?: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token nao fornecido" })
        }
        const token = authHeader.substring(7)

        try {
            const MY_SECRET_KEY = process.env.MY_SECRET_KEY

            if (!MY_SECRET_KEY) {
                throw new Error('chave secreta nao fornecida')
            }
            const decodedToken = verify(token, MY_SECRET_KEY) as DecodedToken

            req.user = { id: decodedToken.userId }

            if (permissions) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: decodedToken.userId
                    },
                    include: {
                        userAccess:{
                            select: {
                                Access: {
                                    select:{
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                })
                const userPermissions = user?.userAccess.map((na) =>na.Access?.name)??[]
                const hasPermissions = permissions.some((p) => userPermissions.includes(p))
                
                if(!hasPermissions){
                    return res.status(403).json({message: "permissao negada"})
                }
            }
            return next()

        } catch (error) {
            return res.status(401).json({message: "Token invalido"})
        }
    }
}