
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HelloWord from "./src/components/HelloWord";



export default function App() {




  return (
    <QueryClientProvider client={new QueryClient()}>
      <HelloWord></HelloWord>
    </QueryClientProvider>
  );
}

