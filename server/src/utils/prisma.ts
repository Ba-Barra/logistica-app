import { PrismaClient } from '@prisma/client';

// Evita múltiples instancias de Prisma en desarrollo
const prisma = new PrismaClient();

export default prisma;