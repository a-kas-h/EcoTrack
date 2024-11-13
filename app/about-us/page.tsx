"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <Header LinkText="Home" LinkUrl="/" LinkText1="Login" LinkUrl1="/login-page" LinkText2="Track" LinkUrl2="/track" />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="space-y-12">
          <h1 className="text-5xl md:text-6xl font-bold flex justify-center items-center">About EcoTrack</h1>
          <p className="text-xl md:text-2xl text-center">
            Harmful emissions are a major concern for the environment and public health. Governments 
            and the public now monitor company emissions, but data transparency and accessibility remain challenges.
          </p>
          
          <h2 className="text-3xl md:text-4xl font-semibold flex justify-center items-center">The Problem?</h2>
          <p className="text-xl md:text-2xl text-center">
            Despite available emission data, issues like inaccurate 
            records and inconsistent reporting persist. A reliable, transparent way to track and reduce emissions is needed.
          </p>
          
          <h2 className="text-3xl md:text-4xl font-semibold flex justify-center items-center">What We Do</h2>
          <p className="text-xl md:text-2xl text-center">
            EcoTrack uses blockchain to provide a decentralized, transparent solution for tracking emissions. 
            This ensures accurate, tamper-proof data and helps monitor environmental impact effectively.
          </p>
          
          <div className="flex flex-col items-center mt-16">
            <ChevronDown className="w-8 h-8 text-primary animate-bounce mb-2" />
            <Link href="/track">
              <Button size="lg" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
