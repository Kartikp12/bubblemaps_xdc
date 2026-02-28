import { Contract, Interface, formatUnits, ZeroAddress } from "ethers";
import { getXdcProvider } from "./xdcProvider";

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

const TRANSFER_TOPIC = new Interface(ERC20_ABI).getEvent("Transfer").topicHash;
// Cap the number of logs we inspect for performance, but
// scan backwards from deployment until we hit this ceiling.
const MAX_LOGS = 5000;
const BLOCK_CHUNK_SIZE = 30_000;

function toHexAddress(address) {
  if (!address) return "";
  return address.toLowerCase().startsWith("0x")
    ? address
    : address.replace(/^xdc/i, "0x");
}

export async function fetchTokenAnalytics(rawAddress) {
  const address = toHexAddress(rawAddress);
  const provider = await getXdcProvider();
  const contract = new Contract(address, ERC20_ABI, provider);

  const [name, symbol, decimals, totalSupplyBn, latestBlock] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
    provider.getBlockNumber(),
  ]);

  const iface = new Interface(ERC20_ABI);
  const startBlock = 0;
  let toBlock = latestBlock;
  let fromBlock = Math.max(startBlock, toBlock - BLOCK_CHUNK_SIZE);
  const logs = [];

  while (toBlock >= startBlock && logs.length < MAX_LOGS) {
    const filter = {
      address,
      fromBlock,
      toBlock,
      topics: [TRANSFER_TOPIC],
    };

    try {
      const chunkLogs = await provider.getLogs(filter);
      logs.push(...chunkLogs);
    } catch (err) {
      if (BLOCK_CHUNK_SIZE > 2000) {
        toBlock = fromBlock;
        fromBlock = Math.max(startBlock, toBlock - Math.floor(BLOCK_CHUNK_SIZE / 2));
        continue;
      }
      throw err;
    }

    toBlock = fromBlock - 1;
    fromBlock = Math.max(startBlock, toBlock - BLOCK_CHUNK_SIZE);
  }

  const candidateAddresses = new Set();
  const adjacency = new Map();
  const flows = new Map();

  const touchFlow = (addr) => {
    if (!addr) return null;
    const key = addr.toLowerCase();
    if (!flows.has(key)) {
      flows.set(key, {
        inCount: 0,
        outCount: 0,
        inValue: 0n,
        outValue: 0n,
      });
    }
    return flows.get(key);
  };

  const addEdge = (from, to) => {
    if (!from || !to || from === to) return;
    if (!adjacency.has(from)) adjacency.set(from, new Set());
    if (!adjacency.has(to)) adjacency.set(to, new Set());
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  };

  for (const log of logs) {
    let parsed;
    try {
      parsed = iface.parseLog(log);
    } catch {
      continue;
    }
    const from = parsed.args.from.toLowerCase();
    const to = parsed.args.to.toLowerCase();
    const value = parsed.args.value;

    if (from !== ZeroAddress) candidateAddresses.add(from);
    if (to !== ZeroAddress) candidateAddresses.add(to);

    if (from !== ZeroAddress) {
      const f = touchFlow(from);
      if (f) {
        f.outCount += 1;
        f.outValue += value;
      }
    }
    if (to !== ZeroAddress) {
      const f = touchFlow(to);
      if (f) {
        f.inCount += 1;
        f.inValue += value;
      }
    }
    if (from !== ZeroAddress && to !== ZeroAddress) {
      addEdge(from, to);
    }
  }

  const cleanedHolders = [];

  const holderAddresses = Array.from(candidateAddresses.values());
  const balanceResults = await Promise.all(
    holderAddresses.map(async (addr) => {
      try {
        const bal = await contract.balanceOf(addr);
        return bal;
      } catch {
        return 0n;
      }
    }),
  );

  for (let i = 0; i < holderAddresses.length; i += 1) {
    const balance = balanceResults[i];
    if (balance <= 0n) continue;
    cleanedHolders.push({ address: holderAddresses[i], balance });
  }

  cleanedHolders.sort((a, b) => (a.balance > b.balance ? -1 : 1));

  const totalSupply = Number(formatUnits(totalSupplyBn, decimals));
  const holders = cleanedHolders.map((h) => {
    const balanceFloat = Number(formatUnits(h.balance, decimals));
    const percentage = totalSupply > 0 ? (balanceFloat / totalSupply) * 100 : 0;
    return { ...h, balanceFloat, percentage };
  });

  const nodeCluster = new Map();
  const clusters = [];
  let clusterId = 0;

  const visited = new Set();

  const holderSet = new Set(holders.map((h) => h.address));

  const dfs = (start, id) => {
    const stack = [start];
    let clusterBalance = 0n;
    const members = [];

    while (stack.length) {
      const node = stack.pop();
      if (!node || visited.has(node)) continue;
      visited.add(node);
      nodeCluster.set(node, id);

      const holder = cleanedHolders.find((h) => h.address === node);
      if (holder) {
        clusterBalance += holder.balance;
        members.push(node);
      }

      const neighbors = adjacency.get(node);
      if (neighbors) {
        for (const next of neighbors) {
          if (!visited.has(next) && holderSet.has(next)) {
            stack.push(next);
          }
        }
      }
    }

    return { members, clusterBalance };
  };

  for (const h of holders) {
    if (visited.has(h.address)) continue;
    const { members, clusterBalance } = dfs(h.address, clusterId);
    if (!members.length) continue;
    clusters.push({
      id: clusterId,
      members,
      balance: clusterBalance,
    });
    clusterId += 1;
  }

  const totalVisibleBalance = clusters.reduce((acc, c) => acc + c.balance, 0n);
  const totalVisibleFloat = Number(formatUnits(totalVisibleBalance, decimals));

  const coloredClusters = clusters.map((c, idx) => {
    const clusterSupplyPct =
      totalVisibleFloat > 0
        ? (Number(formatUnits(c.balance, decimals)) / totalVisibleFloat) * 100
        : 0;
    return {
      ...c,
      colorIndex: idx,
      clusterSupplyPct,
    };
  });

  const enhancedHolders = holders.map((h) => ({
    ...h,
    clusterId: nodeCluster.get(h.address) ?? null,
  }));

  const elements = [];

  for (const h of enhancedHolders) {
    elements.push({
      data: {
        id: h.address,
        label: `${h.address.slice(0, 6)}...${h.address.slice(-4)}`,
        balance: h.balanceFloat,
        percentage: h.percentage,
        clusterId: h.clusterId,
      },
    });
  }

  const edgeSeen = new Set();
  for (const [from, neighbors] of adjacency.entries()) {
    for (const to of neighbors) {
      if (!holderSet.has(from) || !holderSet.has(to)) continue;
      const key = from < to ? `${from}-${to}` : `${to}-${from}`;
      if (edgeSeen.has(key)) continue;
      edgeSeen.add(key);
      elements.push({
        data: {
          id: key,
          source: from,
          target: to,
        },
      });
    }
  }

  const addressFlows = {};
  for (const [addr, f] of flows.entries()) {
    addressFlows[addr] = {
      inCount: f.inCount,
      outCount: f.outCount,
      inValue: Number(formatUnits(f.inValue, decimals)),
      outValue: Number(formatUnits(f.outValue, decimals)),
    };
  }

  return {
    token: {
      address,
      name,
      symbol,
      decimals,
      totalSupply,
    },
    holders: enhancedHolders,
    clusters: coloredClusters,
    graph: {
      elements,
    },
    stats: {
      holdersCount: holders.length,
      transfersAnalyzed: logs.length,
      latestBlock,
    },
    addressFlows,
  };
}

