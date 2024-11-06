"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Header LinkText="Home" LinkUrl="/" LinkText1="About Us" LinkUrl1="/about-us" LinkText2="Track" LinkUrl2="/track" />
            
            {/* Add top padding for spacing */}
            <main className="flex-grow flex items-center justify-center px-4 pt-12 md:pt-16">
                <Card className="w-full max-w-md mb-8">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold">Sign in to EcoTrack</CardTitle>
                        <CardDescription>Enter your details to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="space-y-4">
                                <Input type="account address" placeholder="Account Address" required />
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="keep-signed-in" />
                                    <label htmlFor="keep-signed-in" className="text-sm font-medium">
                                        Keep me signed in
                                    </label>
                                </div>
                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                        <div className="text-sm">
                            <Link href="/signup" className="text-primary hover:underline">
                                Create an Account
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </main>
            
            <Footer />
        </div>
    );
}
