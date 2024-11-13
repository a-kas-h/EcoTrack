"use client"

import { useState } from "react"
import { ethers } from "ethers";
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Contract details
const CONTRACT_ADDRESS = "0x4763C2A9Cf90e39Ba43E8FFb8156c34Dda4BeF5A"
const CONTRACT_ABI = [
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

export default function Login() {
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [privateKey, setPrivateKey] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const checkAuthorization = async (address: string) => {
    try {
        // Ensure that window.ethereum exists and is of the correct type
        if (!window.ethereum) {
            throw new Error("Ethereum provider not found. Please install MetaMask.")
        }

        const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
        return await contract.authorizedNodes(address)
    } catch (error) {
        console.error("Error checking authorization:", error)
        return false
    }
}


    // Handle MetaMask login
    const connectMetaMask = async () => {
        setIsLoading(true)
        try {
            if (!window.ethereum) {
                toast({
                    title: "MetaMask not found",
                    description: "Please install MetaMask extension",
                    variant: "destructive"
                })
                return
            }

            const provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await provider.send("eth_requestAccounts", [])
            
            if (accounts.length === 0) {
                throw new Error("No accounts found")
            }

            const isAuthorized = await checkAuthorization(accounts[0])
            
            if (!isAuthorized) {
                toast({
                    title: "Unauthorized",
                    description: "This address is not an authorized node",
                    variant: "destructive"
                })
                return
            }

            // Store the address in localStorage for persistence
            localStorage.setItem("userAddress", accounts[0])
            
            // Redirect to interface page
            router.push("/interface")
            
        } catch (error) {
            console.error("Error connecting to MetaMask:", error)
            toast({
                title: "Connection Error",
                description: "Failed to connect to MetaMask",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    

    return (
        <div className="min-h-screen flex flex-col">
            <Header LinkText="Home" LinkUrl="/" LinkText1="About Us" LinkUrl1="/about-us" LinkText2="Track" LinkUrl2="/track" />
            
            <main className="flex-grow flex items-center justify-center px-4 pt-12 md:pt-16">
                <Card className="w-full max-w-md mb-8">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold">Sign in to EcoTrack</CardTitle>
                        <CardDescription>Connect your wallet or use private key</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button 
                            className="w-full"
                            onClick={connectMetaMask}
                            disabled={isLoading}
                        >
                            {isLoading ? "Connecting..." : "Connect with MetaMask"}
                        </Button>
                    </CardContent>
                </Card>
            </main>
            
            <Footer />
        </div>
    )
}