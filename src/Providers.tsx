import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from '../backend/trpc'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";

const queryClient = new QueryClient();
export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc'
    })
  ]
})

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )

}
