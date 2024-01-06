import { trpc } from './Providers'

function App() {
  const { data } = trpc.hello.useQuery("jim")

  return (
    <div>{data}</div>
  )
}

export default App
