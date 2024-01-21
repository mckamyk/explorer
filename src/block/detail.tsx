import { formatEther } from "viem"
import { trpc } from "../Providers"
import { blockDetailRoute } from "../routes"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { Link } from "@tanstack/react-router"

export default () => {
  const { blockNumber } = blockDetailRoute.useParams()
  const { data } = trpc.getBlockDetail.useQuery(blockNumber)

  if (!data) return <div>loading</div>

  return (
    <div>
      <div>Block: {Number(data.number)}</div>

      <div className="bg-black/25 rounded-lg p-4">
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Block Height:</div>
          <div className="col-span-3 flex items-center">
            <span className="mr-2">{Number(data.number)}</span>
            <Link to="/block/$blockNumber" params={{ blockNumber: blockNumber - 1 }}>
              <ArrowLeftIcon className="h-8 w-8 rounded-md bg-gray-900 hover:bg-gray-800 transition-colors text-center p-2" />
            </Link>
            <div className="w-2" />
            <Link to="/block/$blockNumber" params={{ blockNumber: blockNumber + 1 }}>
              <ArrowRightIcon className="h-8 w-8 rounded-md bg-gray-900 hover:bg-gray-800 transition-colors text-center p-2" />
            </Link>
          </div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Block Hash:</div>
          <div className="col-span-3">{data.hash}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Timestamp:</div>
          <div className="col-span-3">{new Date(data.timestamp).toLocaleString()}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Transactions:</div>
          <div className="col-span-3">{data.numTransactions} transactions.</div>
        </div>

        <div className="h-px border-b-white/5 border w-full" />

        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Fee Recipient:</div>
          <div className="col-span-3">{data.recipientEns && `(${data.recipientEns}) `}{data.recipient}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Block Reward:</div>
          <div className="col-span-3">{formatEther(data.reward)}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Total Difficulty:</div>
          <div className="col-span-3">{data.totalDifficulty.toLocaleString()}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Block Size:</div>
          <div className="col-span-3">{data.size.toLocaleString()} bytes</div>
        </div>

        <div className="h-px border-b-white/5 border w-full" />

        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Gas Used:</div>
          <div className="col-span-3">{data.gasUsed.toLocaleString()}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Gas Limit:</div>
          <div className="col-span-3">{data.gasLimit.toLocaleString()}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Base Fee Per Gas:</div>
          <div className="col-span-3">{formatEther(data.baseFee, 'gwei')}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Burnt Fees:</div>
          <div className="col-span-3">{formatEther(data.burntFees)}</div>
        </div>
        <div className="py-4 grid grid-cols-4">
          <div className="col-span-1">Extra Data:</div>
          <div className="col-span-3">{data.extraDataParsed} (Hex: {data.extraData})</div>
        </div>
      </div>
    </div>
  )
}
