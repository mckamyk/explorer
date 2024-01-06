import { formatEther } from "viem"
import { trpc } from "../Providers"
import { shortAddr, timeDiff } from "../utilities/utils"
import { useEffect, useRef } from "react"

export default () => {
  const { data } = trpc.getBlocks.useQuery()

  return (
    <div className="flex justify-center">
      <div className="max-w-[1400px] w-full">
        <div className="grid grid-cols-10 px-2 h-8 border-b border-b-white/15 items-center font-bold text-sm">
          <div className="text-center">Number</div>
          <div className="text-center">Age</div>
          <div className="text-center">Txns</div>
          <div className="text-center">Fee Recipient</div>
          <div className="text-center col-span-2">Gas Used</div>
          <div className="text-center">Gas Limit</div>
          <div className="text-center">Base Fee</div>
          <div className="text-center">Reward</div>
          <div className="text-center">Burnt Fees</div>
        </div>
        <div className="flex flex-col">
          {data && data.map(block => (
            <div key={block.number} className="bg-black grid grid-cols-10 px-2 py-2 border-b border-b-white/15 items-center">
              <div className="text-center">{block.number}</div>
              <div className="text-center">{timeDiff(block.timestamp)}</div>
              <div className="text-center">{block.numTxns}</div>
              <div>{shortAddr(block.recipient)}</div>
              <div className="col-span-2 px-1">
                <div className="flex justify-between items-end">
                  <span>{block.gas.used.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">
                    ({(block.gas.used / block.gas.limit * 100).toFixed(0)}%)
                  </span>
                </div>
                <Progress pct={block.gas.used / block.gas.limit} />
              </div>
              <div className="text-center">{block.gas.limit.toLocaleString()}</div>
              <div className="text-center">{Number(formatEther(BigInt(block.baseFee), 'gwei')).toFixed(4)} <span className="text-xs text-gray-500">Gwei</span></div>
              <div className="text-center">{Number(formatEther(BigInt(block.reward))).toFixed(4)} <span className="text-xs text-gray-500">ETH</span></div>
              <div className="text-center">{Number(formatEther(BigInt(block.burntFees))).toFixed(4)} <span className="text-xs text-gray-500">ETH</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Progress = ({ pct }: { pct: number }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = `${(pct * 100).toFixed(0)}%`
    }
  }, [pct, ref.current])


  return (
    <div className="relative w-full bg-gray-600 h-1">
      <div ref={ref} className={`w-[${(pct * 100).toFixed(0)}%] bg-blue-600 h-1 absolute`} />
    </div>
  )
}

