import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Header = () => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-2 max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-100">Liquidity buffers</h1>
        <p className="text-sm text-zinc-500">
          Liquidity buffers are an internal mechanism of the Balancer v3 Vault
          that enable gas efficient swaps in boosted pools. For more info{" "}
          <a
            href="https://docs.balancer.fi/concepts/vault/buffer.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
          >
            read the docs
          </a>{" "}
          and check out this{" "}
          <a
            href="https://x.com/RaqPawel/status/1871291256086639004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
          >
            thread on X
          </a>
          .
        </p>
      </div>
      <Select defaultValue="mainnet">
        <SelectTrigger className="w-48 ml-8">
          <div className="flex items-center">
            <Image
              src="/mainnet.svg"
              alt="Mainnet"
              width={16}
              height={16}
              className="mr-2"
            />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mainnet">Mainnet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
