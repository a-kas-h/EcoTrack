"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const initialData = [
  { name: "Tata", emissions: 75 },
  { name: "Chrysler", emissions: 62 },
  { name: "Volkswagen", emissions: 88 },
  { name: "Renault", emissions: 45 },
  { name: "Suzuki", emissions: 53 },
]

export default function TrackingPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(initialData)

  useEffect(() => {
    const filtered = initialData.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm])

  const selectedCompanyData = selectedCompany 
    ? initialData.find(item => item.name === selectedCompany) 
    : null

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header LinkText="Home" LinkUrl="/" LinkText1="About Us" LinkUrl1="/about-us" LinkText2="Login" LinkUrl2="/login-page" />
      <main className="flex-grow container mx-auto px-4 py-8 pt-16">
        <h1 className="text-4xl font-bold mt-8 mb-12 text-center">Emission Tracking</h1>
        <div className="mb-6 relative">
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Company Emission Percentages</CardTitle>
            <CardDescription>Comparing emission levels across various companies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar
                    dataKey="emissions"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => setSelectedCompany(data.name)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {selectedCompanyData && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{selectedCompanyData.name} Details</CardTitle>
              <CardDescription>Detailed emission information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Emission percentage: {selectedCompanyData.emissions}%
              </p>
              <p className="mt-2">
                {selectedCompanyData.name} is {selectedCompanyData.emissions < 60 ? "below" : "above"} the industry average.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer/>
    </div>
  )
}