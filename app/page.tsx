"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Shield, Zap, Eye, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import "./about-us/page"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LandingPage() {
  
  return (
    
    <div className="min-h-screen bg-background text-foreground ">
      <Header LinkText="About Us" LinkUrl="/about-us" LinkText1="Login" LinkUrl1="/login-page" LinkText2="Track" LinkUrl2="/track"></Header>
      <main>
        <section className="py-32 md:py-48 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Track Emissions with Blockchain Technology</h1>
            <p className="text-xl mb-8 text-muted-foreground">Ensuring accurate, transparent, and secure emission tracking</p>
            <a href="/track"><Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button></a>
          </div>
        </section>
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose EcoTrack?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Eye className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-muted-foreground">Track emissions in real-time with our blockchain-based system</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
                <p className="text-muted-foreground">Leverage blockchain technology for tamper-proof and transparent emission data</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Efficient Reporting</h3>
                <p className="text-muted-foreground">Generate comprehensive reports with ease for regulatory compliance</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  )
}