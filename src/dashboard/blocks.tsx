import { trpc } from '../Providers'
import { CubeIcon } from '@heroicons/react/24/outline'

const timeDiff = (timestamp: number): string => {

}

export default () => {
  const { data } = trpc.latestBlocks.useQuery();
  const currentTime = Date.now()

  return (
    <div className="w-[600px] bg-black/25 rounded-lg shadow shadow-white/25">
      <div className="p-2 font-bold">Latest Blocks</div>
      <div className="p-2">
        {data && data.map(block => (
          <div>
            <CubeIcon className="h-8 w-8 text-gray-700" />
            <div>
              <div>{block.number}</div>
              <div>{new Date(currentTime - block.timestamp).getUTCSeconds()} seconds ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
