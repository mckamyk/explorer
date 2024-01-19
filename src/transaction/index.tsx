import { formatEther } from "viem"
import { trpc } from "../Providers"
import { timeDiff } from "../utilities/utils"
import { Link } from "@tanstack/react-router"

export default () => {
  const { data } = trpc.getTransactions.useQuery()

  return (
    <div className="flex justify-center my-10">
      <div className="max-w-[1400px] w-full bg-black/25 rounded-lg overflow-clip shadow-white/10 shadow-lg">
        <div className="grid grid-cols-8 px-2 h-8 border-b border-b-white/15 items-center font-bold text-sm">
          <div className="">Txn Hash</div>
          <div className="">Method</div>
          <div className="">Block</div>
          <div className="">Age</div>
          <div className="">From</div>
          <div className="">To</div>
          <div className="">Value</div>
          <div className="">Txn Fee</div>
        </div>
        <div className="flex flex-col">
          {data && data.map(txn => (
            <div key={txn.hash} className="grid grid-cols-8 px-2 py-2 border-b border-b-white/15 items-center">
              <div className="underline text-blue-500">{txn.hash.slice(0, 10)}...</div>
              <div className="text-red-500">method</div>
              <Link to="/block/$blockNumber" params={{ blockNumber: Number(txn.blockNumber) }} className="underline text-blue-500">{txn.blockNumber.toLocaleString()}</Link>
              <div>{timeDiff(txn.timestamp)}</div>
              <div className="">{txn.from.slice(0, 10)}...</div>
              <div className="">{txn.to ? txn.to.slice(0, 10) : 'Contract Creation'}...</div>
              <div className="">{weiFormat(txn.value)} <span className="text-xs text-gray-500 ml-2">eth</span></div>
              {/* <div className="">{Number(formatEther(BigInt(block.reward))).toFixed(4)} <span className="text-xs text-gray-500">ETH</span></div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const weiFormat = (val: bigint) => {
  return Number(Number(formatEther(val)).toFixed(3)).toLocaleString()
}

