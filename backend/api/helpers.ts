import { client } from "../crypto/client"

export const getEns = async (address: `0x${string}` | string): Promise<string | null> => {
  try {
    const ens = await client.getEnsName({ address: address as `0x${string}` })
    return ens
  } catch {
    return null
  }
}

