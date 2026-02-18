import { useEffect, useState } from "react";
import { JsonRpcProvider, Wallet } from "ethers";
import { formatEther } from "viem";

export const useDevAccount = () => {
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const initDevAccount = async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";

      if (!rpcUrl) {
        console.warn("useDevAccount: NEXT_PUBLIC_RPC_URL is not set");
        return;
      }

      // ethers v6 requires a 32-byte hex private key (0x + 64 hex chars)
      const isValidPrivateKey = /^0x[0-9a-fA-F]{64}$/.test(privateKey);
      if (!isValidPrivateKey) {
        console.warn("useDevAccount: NEXT_PUBLIC_PRIVATE_KEY is missing or invalid; skipping dev account");
        return;
      }

      try {
        const provider = new JsonRpcProvider(rpcUrl);
        const wallet = new Wallet(privateKey, provider);

        setAddress(wallet.address);

        const accountBalance = await provider.getBalance(wallet.address);
        setBalance(formatEther(BigInt(accountBalance)));
      } catch (error) {
        console.error("useDevAccount: failed to initialize dev account", error);
      }
    };

    initDevAccount();
  }, []);

  return { balance, address };
};
