import { formatEther } from 'viem'
import { trpc } from '../Providers'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { shortAddr, timeDiff } from '../utilities/utils';

export default () => {
  const { data } = trpc.latestTransactions.useQuery();

  return (
    <div className="w-[600px] bg-black/25 rounded-lg shadow shadow-white/25">
      <div className="p-2 font-bold">Latest Blocks</div>
      <div className="p-2">
        {data && data.map(txn => (
          <div key={txn.hash} className="flex gap-4 border-b-white/20 border-b last:border-b-0 items-center py-2">
            <DocumentTextIcon className="h-8 w-8 text-gray-700" />
            <div className="flex flex-col items-center">
              <div>{shortAddr(txn.hash)}</div>
              <div className="text-xs">{timeDiff(txn.timestamp)}</div>
            </div>

            <div className="flex flex-col items-center grow">
              <div>From {shortAddr(txn.from)}</div>
              <div>{txn.to ? `To ${shortAddr(txn.to)}` : "Contract Creation"}</div>
            </div>

            <div className="rounded-full bg-white/10 px-3 py-1">
              {Number(formatEther(BigInt(txn.value))).toFixed(3)} eth
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
