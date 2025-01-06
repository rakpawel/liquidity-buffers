import { Badge } from "@/components/ui/badge";
import { Token } from "@/services/api";

type TooltipPayload = {
  payload: {
    token: Token;
    underlying: number;
    wrapped: number;
  };
};

export const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (active && payload && payload.length) {
    const { token, underlying, wrapped } = payload[0].payload;
    const total = underlying + wrapped;
    const ratios = {
      underlying: ((underlying / total) * 100).toFixed(1),
      wrapped: ((wrapped / total) * 100).toFixed(1),
    };

    return (
      <div className="bg-zinc-900 p-3 rounded-lg shadow-lg border border-zinc-800 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-semibold text-zinc-200">{token.name}</p>
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
            {token.symbol}
          </Badge>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-8">
            <span className="text-zinc-400">Underlying:</span>
            <span className="text-[#3366FF] font-medium">
              {underlying.toFixed(2)} ({ratios.underlying}%)
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-zinc-400">Wrapped:</span>
            <span className="text-[#4ADE80] font-medium">
              {wrapped.toFixed(2)} ({ratios.wrapped}%)
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
