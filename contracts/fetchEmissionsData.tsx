import { ethers } from "ethers";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import EmissionTrackerABI from "./EmissionTracker.json"; // Add the correct path to your ABI file

const CONTRACT_ADDRESS = "0xA79a2cCB1733D6c96E1a042382aB6330C9932aAc"; // Replace with your contract's address

interface EmissionData {
  name: string;
  emissions: number;
  isVerified: boolean;
}

export default function TrackingPage() {
  // Explicitly type the emissionData state as an array of EmissionData
  const [emissionData, setEmissionData] = useState<EmissionData[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask provider not detected");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EmissionTrackerABI, signer);

      const totalEmissions = await contract.totalEmissions();
      const data: EmissionData[] = [];

      for (let i = 0; i < totalEmissions; i++) {
        const emission = await contract.getEmissionData(i);
        data.push({
          name: emission[0],           // deviceId
          emissions: emission[2].toNumber(), // emissionLevel
          isVerified: emission[3],     // isVerified
        });
      }

      setEmissionData(data); // Set fetched data to state
    }

    fetchData();
  }, []);

  return (
    <div>
      {/* Render emission data or use it for charts here */}
    </div>
  );
}
