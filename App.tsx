
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HelloWord from "./components/HelloWord";



export default function App() {




  return (
    <QueryClientProvider client={new QueryClient()}>
      <HelloWord></HelloWord>
    </QueryClientProvider>
  );
}

