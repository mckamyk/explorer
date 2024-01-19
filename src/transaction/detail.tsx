import { transactionDetailRoute } from "../routes"

export default () => {
  const { hash } = transactionDetailRoute.useParams();

  return (
    <div>{hash}</div>
  )
}
