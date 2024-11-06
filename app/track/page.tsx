"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers";
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Contract details
const contractAddress = "0x4763C2A9Cf90e39Ba43E8FFb8156c34Dda4BeF5A"
const contractABI = [
  
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "node",
          "type": "address"
        }
      ],
      "name": "authorizeNode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "node",
          "type": "address"
        }
      ],
      "name": "deauthorizeNode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "node",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "companyName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "EmissionRecorded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "node",
          "type": "address"
        }
      ],
      "name": "NodeAuthorized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "node",
          "type": "address"
        }
      ],
      "name": "NodeDeauthorized",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "companyName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "recordEmission",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "authorizedNodes",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "emissions",
      "outputs": [
        {
          "internalType": "address",
          "name": "node",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "companyName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEmissionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getEmissionRecord",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  
]

interface EmissionData {
  name: string;
  emissions: number;
}

export default function TrackingPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState<EmissionData[]>([])
  const [allData, setAllData] = useState<EmissionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to load emission records from the blockchain
  const loadEmissions = async () => {
    try {
      // Check if window.ethereum exists
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Web3 wallet")
      }

      // Connect to Ethereum network using ethers v6 syntax
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractABI, provider)

      // Fetch emission count to loop over emissions
      const emissionCount = await contract.getEmissionCount()
      const emissions: EmissionData[] = []

      for (let i = 0; i < Number(emissionCount); i++) {
        const record = await contract.getEmissionRecord(i)
        emissions.push({
          name: record[1], // companyName
          emissions: Number(record[2]), // amount in kilotons or metric tons
        })
      }
      
      setAllData(emissions)
      setFilteredData(emissions)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching emission records:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmissions()
  }, [])

  useEffect(() => {
    // Filter data based on the search term
    const filtered = allData.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm, allData])

  const selectedCompanyData = selectedCompany 
    ? filteredData.find(item => item.name === selectedCompany) 
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
        
        {isLoading ? (
          <p className="text-center">Loading emission data...</p>
        ) : (
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
        )}

        {selectedCompanyData && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{selectedCompanyData.name} Details</CardTitle>
              <CardDescription>Detailed emission information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Emission amount: {selectedCompanyData.emissions} kilotons / metric tons of carbon
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