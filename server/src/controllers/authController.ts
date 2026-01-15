import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma'; // O '../models/prisma' dependiendo de donde tengas tu instancia

const SECRET = process.env.JWT_SECRET || 'secreto_por_defecto';

// 1. REGISTRO DE USUARIO
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en BD
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN' // Por defecto serán administradores por ahora
      }
    });

    res.status(201).json({ message: 'Usuario creado con éxito', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// 2. INICIAR SESIÓN (LOGIN)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Comparar contraseña encriptada
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Generar Token
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '8h' });

    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};