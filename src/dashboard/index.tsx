import Blocks from "./blocksSummary"
import Transactions from "./txSummary"

export default () => {
  return (
    <div className="flex justify-center gap-4 pt-8">
      <Blocks />
      <Transactions />
    </div>
  )
}
