"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const CONTRACT_ADDRESS = "0x4763C2A9Cf90e39Ba43E8FFb8156c34Dda4BeF5A"
const CONTRACT_ABI = [
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
	}
]

interface EmissionRecord {
    node: string;
    companyName: string;
    amount: number;
    timestamp: number;
}

export default function Interface() {
    const router = useRouter()
    const [companyName, setCompanyName] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [emissions, setEmissions] = useState<EmissionRecord[]>([])

    useEffect(() => {
        // Check if user is authenticated
        const userAddress = localStorage.getItem("userAddress")
        if (!userAddress) {
            router.push("/login")
            return
        }

        // Load emissions data
        loadEmissions()
    }, [])

    const getContract = async (withSigner = false) => {
        if (!window.ethereum) {
            throw new Error("Ethereum provider not found. Please install MetaMask.")
        }
    
        const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider)
        const userAddress = localStorage.getItem("userAddress")
        const privateKey = localStorage.getItem("userPrivateKey")
    
        if (withSigner) {
            let signer
            if (privateKey) {
                signer = new ethers.Wallet(privateKey, provider)
            } else {
                signer = await provider.getSigner(userAddress!)
            }
            return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        }
    
        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    }
    

    const loadEmissions = async () => {
        try {
            const contract = await getContract()
            const count = await contract.getEmissionCount()
            const records: EmissionRecord[] = []
    
            for (let i = 0; i < Number(count); i++) {
                const record = await contract.getEmissionRecord(i)
                records.push({
                    node: record[0],
                    companyName: record[1],
                    amount: Number(record[2]),
                    timestamp: Number(record[3])
                })
            }
    
            // Reverse the records to show most recent first
            setEmissions(records.reverse())
        } catch (error) {
            console.error("Error loading emissions:", error)
            toast({
                title: "Error",
                description: "Failed to load emission records",
                variant: "destructive"
            })
        }
    }
    

    const recordEmission = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const contract = await getContract(true)
            const tx = await contract.recordEmission(companyName, ethers.parseUnits(amount, "wei"))
            await tx.wait()

            toast({
                title: "Success",
                description: "Emission recorded successfully",
            })

            // Reset form and reload data
            setCompanyName("")
            setAmount("")
            loadEmissions()
        } catch (error) {
            console.error("Error recording emission:", error)
            toast({
                title: "Error",
                description: "Failed to record emission",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("userAddress")
        localStorage.removeItem("userPrivateKey")
        router.push("/login")
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header LinkText="Home" LinkUrl="/" LinkText1="About Us" LinkUrl1="/about-us" LinkText2="Track" LinkUrl2="/track" />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Node Interface</h1>
                    <Button variant="outline" onClick={logout}>Logout</Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Record New Emission</CardTitle>
                            <CardDescription>Enter emission details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={recordEmission} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Company Name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="number"
                                        placeholder="Emission Amount (in tons)"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Recording..." : "Record Emission"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Emissions</CardTitle>
                            <CardDescription>Latest recorded emissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {emissions.map((emission, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="font-medium">{emission.companyName}</div>
                                        <div className="text-sm text-gray-500">
                                            Amount: {emission.amount} tons
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Date: {new Date(emission.timestamp * 1000).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}