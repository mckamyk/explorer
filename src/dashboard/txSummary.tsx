import { formatEther } from 'viem'
import { trpc } from '../Providers'
import { ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { shortAddr, timeDiff } from '../utilities/utils';
import { Link } from '@tanstack/react-router';

export default () => {
  const { data, isLoading } = trpc.latestTransactions.useQuery();

  return (
    <div className="w-[600px] bg-black/25 rounded-lg shadow shadow-white/25">
      <div className="p-2 font-bold">Latest Transactions</div>
      <div className="p-2 flex flex-col gap-y-1">
        {isLoading && (new Array(10).fill(0)).map((_, i) => <Loading key={i} />)}
        {data && data.map(txn => (
          <div key={txn.hash} className="h-[65px] flex gap-4 border-b-white/20 border-b last:border-b-0 items-center py-2">
            <DocumentTextIcon className="h-8 w-8 text-gray-700" />
            <div className="flex flex-col items-center">
              <Link className="text-blue-500 underline" to="/transaction/$hash" params={{ hash: txn.hash }}>{shortAddr(txn.hash)}</Link>
              <div className="text-xs">{timeDiff(txn.timestamp)}</div>
            </div>

            <div className="flex flex-col items-center grow">
              <div>From {shortAddr(txn.from)}</div>
              <div>{txn.to ? `To ${shortAddr(txn.to)}` : "Contract Creation"}</div>
            </div>

            <div className="rounded-full bg-white/10 px-3 py-1">
              {Number(formatEther(txn.value)).toFixed(3)} eth
            </div>
          </div>
        ))}
      </div>
      <Link to="/transaction" className="flex items-center justify-center py-2 transition-colors bg-white/5 hover:bg-white/15">
        <span className="font-bold">View All Transactions</span>
        <ArrowRightIcon className="ml-4 h-4 w-4" />
      </Link>
    </div>
  )
}

const Loading = () => {
  return (
    <div className="h-[65px] animate-pulse bg-white/5">
    </div>
  )
}
