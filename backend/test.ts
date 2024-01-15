import { tryGetBlock } from "./api/blocks";

const startTime = Date.now()
tryGetBlock(16999998n).then(b => {
  console.log(`Got ${b.number} in ${Date.now() - startTime}`)
})
tryGetBlock(16999999n).then(b => {
  console.log(`Got ${b.number} in ${Date.now() - startTime}`)
})

