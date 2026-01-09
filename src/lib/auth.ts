
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account.provider === "google") {
                try {
                    const db = await connectDB().catch(() => null)
                    if (db) {
                        // Check if user exists
                        const existingUser = await User.findOne({ email: user.email })

                        if (!existingUser) {
                            // Create new user automatically
                            await User.create({
                                name: user.name,
                                email: user.email,
                                image: user.image,
                                phone: null, // Google doesn't always provide phone
                                role: 'user',
                                points: 0,
                                rank: 'Новичок',
                                reportsCount: 0
                            })
                        }
                    }
                    return true
                } catch (error) {
                    console.error("Error saving user from Google:", error)
                    return true // Allow sign in even if DB fails, for demo
                }
            }
            return true
        },
        async session({ session, token }: any) {
            // Add user ID to session
            if (session?.user) {
                // fetch additional data from DB if needed
            }
            return session
        }
    },
    pages: {
        signIn: '/?view=login',
        error: '/?view=login&error=true'
    }
}
