import { JsonRpcProvider } from "ethers";

const RPC_URLS = [
  "https://erpc.xdcrpc.com",
  "https://rpc.xdc.org",
  "https://rpc.xdcrpc.com",
  "https://rpc.ankr.com/xdc",
  "https://rpc.xdc.network",
  "https://earpc.xinfin.network",
  "https://rpc.xinfin.network",
  "https://erpc.xinfin.network",
  "https://rpc1.xinfin.network",
];

let cachedProvider = null;
let cachedUrl = null;
let currentIndex = 0;

async function probeProvider(url) {
  const provider = new JsonRpcProvider(url);
  // Lightweight health check: latest block number
  await provider.getBlockNumber();
  return provider;
}

export async function getXdcProvider() {
  if (cachedProvider && cachedUrl) {
    try {
      await cachedProvider.getBlockNumber();
      return cachedProvider;
    } catch {
      cachedProvider = null;
      cachedUrl = null;
    }
  }

  let attempts = 0;
  let lastError = null;

  while (attempts < RPC_URLS.length) {
    const url = RPC_URLS[currentIndex];
    currentIndex = (currentIndex + 1) % RPC_URLS.length;

    try {
      const provider = await probeProvider(url);
      cachedProvider = provider;
      cachedUrl = url;
      return provider;
    } catch (err) {
      lastError = err;
    }

    attempts += 1;
  }

  throw lastError ?? new Error("Unable to connect to any XDC RPC endpoint");
}

export function getRpcUrls() {
  return [...RPC_URLS];
}

