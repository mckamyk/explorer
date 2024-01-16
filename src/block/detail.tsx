import { trpc } from "../Providers"
import { blockDetailRoute } from "../routes"

export default () => {
  const { blockNumber } = blockDetailRoute.useParams()
  const { data } = trpc.getBlockDetail.useQuery(blockNumber)

  return (
    <pre>{Number(data?.number)}</pre>
  )
}
