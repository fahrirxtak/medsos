import * as z from "zod";
import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
    try {
        // validation
        const userScheme = z.object({
            fullname: z.string().min(6, "Fullname minimal 6 karakter"),
            username: z.string().min(6, "Username minimal 6 karakter"),
            email: z.email("Email harus berformat email example@gmail.com"),
            password: z.string().min(8, "password minimal 8 karakter"),
        })

        const validated = userScheme.parse(req.body)

        // check apakah email dan username sudah terdaftar atau belum
        const emailExiting = await prisma.user.findUnique({
            where: {
                email: validated.email
            }
        })

        if (emailExiting) {
            return res.status(400).json({ message: "Email sudah terdaftar silahkan gunakan Email lain" })
        }

        const userExiting = await prisma.user.findUnique({
            where: {
                username: validated.username
            }
        })
        if (userExiting) {
            return res.status(400).json({ message: "Username sudah terdaftar silahkan gunakan Username lain" })
        }


        // Enkripsi password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(validated.password, salt)

        // insert data ke database
        const newUser = await prisma.user.create({
            data: {
                fullname: validated.fullname,
                username: validated.username,
                password: hashedPassword,
                email: validated.email
            }
        })

        const jwtSecret = process.env.JWTSECRET
        let token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: '6d' })

        return res.status(201).json({
            message: "register berhasil",
            data: {
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                image: newUser.image,
                bio: newUser.bio
            },
            token: token
        })

    } catch (err) {
        if (err instanceof Error && 'issues' in err) {
            // zod
            const errors = err.issues.map((i) => i.message)
            return res.status(400).json({
                message: errors
            })
        }
        // express
        console.log(err);
        res.status(500).json({ message: "Server Down" })
    }
}

export const LoginUser = async (req, res) => {
    try {
        // validation email sama password
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            })
        }

        const exitingEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!exitingEmail) {
            return res.status(400).json({
                message: "Email belum terdaftar silahkan register"
            })
        }

        // bandingkan password req body dengan password database bcrypt

        const comparePassword = bcrypt.compareSync(password, exitingEmail.password)

        if (!comparePassword) {
            return res.status(400).json({
                message: "Invalid User"
            })
        }

        // buat jwt simpan id user ke jwt
        const jwtSecret = process.env.JWTSECRET

        let token = jwt.sign({ id: exitingEmail.id }, jwtSecret, { expiresIn: '6d' })

        // Res Success
        return res.status(201).json({
            message: "Login berhasil",
            data: {
                id: exitingEmail.id,
                fullname: exitingEmail.fullname,
                username: exitingEmail.username,
                email: exitingEmail.email,
                image: exitingEmail.image,
                bio: exitingEmail.bio
            },
            token: token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Down" })
    }
}

export const GetUser = async(req, res) => {
    res.status(200).json({
        message: "Berhasil get User",
        data: req.user
    })
}