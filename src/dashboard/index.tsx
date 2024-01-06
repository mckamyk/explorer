import Blocks from "./blocks"
import Transactions from "./transactions"

export default () => {
  return (
    <div className="flex justify-center gap-4 pt-8">
      <Blocks />
      <Transactions />
    </div>
  )
}
