import { Link } from "@tanstack/react-router";
import { trpc } from "../Providers";
import { transactionDetailRoute } from "../routes"
import { timeDiff } from "../utilities/utils";
import { formatEther } from "viem";

export default () => {
  const { hash } = transactionDetailRoute.useParams();
  const { data } = trpc.getTransactionDetail.useQuery(hash)


  return (
    <div>
      <div className="font-bold text-lg ml-4">Transaction Details</div>

      {data && (
        <div className="bg-black/25 rounded-lg p-4">
          <div className="py grid grid-cols-4 gap-y-4">
            <div className="col-span-1">Transaction Hash:</div>
            <div className="col-span-3">{hash}</div>

            <div className="col-span-1">Block:</div>
            <Link to="/block/$blockNumber" params={{ blockNumber: Number(data.blockNumber) }} className="text-blue-500 underline col-span-3">{data.blockNumber.toLocaleString()}</Link>

            <div className="col-span-1">Timestamp:</div>
            <div className="col-span-3">({timeDiff(data.timestamp)} ago) {new Date(data.timestamp).toLocaleString()}</div>

            <div className="col-span-1">From:</div>
            <div className="col-span-3">{data.from}</div>

            <div className="col-span-1">To:</div>
            <div className="col-span-3">{data.to || "Contract Creation"}</div>

            <div className="col-span-1">Value:</div>
            <div className="col-span-3">{formatEther(data.value)}</div>

            <div className="col-span-1">Transaction Fee:</div>
            <div className="col-span-3">{formatEther(data.paidFees)}</div>

            <div className="col-span-1">Gas Price:</div>
            <div className="col-span-3">{formatEther(data.gasPrice, 'gwei')} gwei ({formatEther(data.gasPrice)} eth)</div>
          </div>
        </div>
      )}
    </div >
  )
}
