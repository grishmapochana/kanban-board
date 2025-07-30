"use client";
import { NhostProvider } from "@nhost/nextjs";
import { nhost } from "@/lib/nhost";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo";
// import { ApolloProvider } from "@apollo/client";
// import { client } from "@/lib/apollo";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </NhostProvider>
  );
}
