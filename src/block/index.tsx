import { formatEther } from "viem"
import { trpc } from "../Providers"
import { shortAddr, timeDiff } from "../utilities/utils"

export default () => {
  const { data, isLoading } = trpc.getBlocks.useQuery()

  return (
    <div className="flex justify-center">
      <div className="max-w-[1200px] w-full">
        <div className="grid grid-cols-10 px-2 h-8 border-b border-b-white/15 items-center font-bold">
          <div className="">Number</div>
          <div>Age</div>
          <div>Txns</div>
          <div>Fee Recipient</div>
          <div className="col-span-2">Gas Used</div>
          <div>Gas Limit</div>
          <div>Base Fee</div>
          <div>Reward</div>
          <div>Burnt Fees</div>
        </div>
        <div className="bg-black flex flex-col">
          {data && data.map(block => (
            <div key={block.number} className="grid grid-cols-10 px-2 p-1 h-8 border-b border-b-white/15 items-center">
              <div>{block.number}</div>
              <div>{timeDiff(block.timestamp)}</div>
              <div className="text-center">{block.numTxns}</div>
              <div>{shortAddr(block.recipient)}</div>
              <div className="col-span-2">gas used</div>
              <div>{block.gas.limit.toLocaleString()}</div>
              <div>{Number(formatEther(BigInt(block.baseFee), 'gwei')).toFixed(4)} <span className="text-xs text-gray-500">Gwei</span></div>
              <div>{Number(formatEther(BigInt(block.reward))).toFixed(4)} <span className="text-xs text-gray-500">ETH</span></div>
              <div>{Number(formatEther(BigInt(block.burntFees))).toFixed(12)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
