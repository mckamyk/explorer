import { formatEther } from 'viem'
import { trpc } from '../Providers'
import { CubeIcon } from '@heroicons/react/24/outline'
import { shortAddr, timeDiff } from '../utilities/utils';
import { Link } from '@tanstack/react-router';

export default () => {
  const { data, isLoading } = trpc.latestBlocks.useQuery();

  return (
    <div className="w-[600px] bg-black/25 rounded-lg shadow shadow-white/25 overflow-clip">
      <div className="p-2 font-bold">Latest Blocks</div>
      <div className="p-2 flex flex-col gap-y-1">
        {isLoading && (new Array(10).fill(0)).map((_, i) => <Loading key={i} />)}
        {data && data.map(block => (
          <div key={block.hash} className="h-[65px] flex gap-4 border-b-white/20 border-b last:border-b-0 items-center py-2">
            <CubeIcon className="h-8 w-8 text-gray-700" />
            <div className="flex flex-col items-center">
              <div>{block.number}</div>
              <div className="text-xs">{timeDiff(block.timestamp)}</div>
            </div>

            <div className="flex flex-col items-center grow">
              <div>Fee Recipient: {shortAddr(block.recipient)}</div>
              <div>{block.numTxns} transactions</div>
            </div>

            <div className="rounded-full bg-white/10 px-3 py-1">
              {Number(formatEther(BigInt(block.value))).toFixed(3)} eth
            </div>
          </div>
        ))}
      </div>
      <Link to="/block" className="flex items-center justify-center py-2 transition-colors bg-white/5 hover:bg-white/15">
        <span className="font-bold">View All Blocks</span>
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
