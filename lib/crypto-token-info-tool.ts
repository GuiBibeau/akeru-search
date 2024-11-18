import tokens from "../top-tokens.json";
import allTokens from "../token.json";

export class CryptoTokenInfoTool {
  private apiKey: string;
  private baseUrl: string;

  constructor(network: string = "eth-mainnet") {
    this.apiKey = process.env.ALCHEMY_API_KEY!;
    this.baseUrl = `https://${network}.g.alchemy.com/v2/${this.apiKey}`;
  }

  async getTokenPrice(tokenSymbol: string) {
    try {
      const baseUrl = `https://api.g.alchemy.com/prices/v1/${this.apiKey}/tokens/by-symbol`;

      const params = new URLSearchParams();
      params.append("symbols", tokenSymbol);

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw error;
    }
  }

  async getTokenMetadata(tokenAddress: string) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenMetadata",
          params: [tokenAddress],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error fetching token metadata:", error);
      throw error;
    }
  }

  getTokenFromSymbolNameOrId(symbolNameOrId: string) {
    try {
      const tokenByName = tokens.find(
        (token) => token.name.toLowerCase() === symbolNameOrId.toLowerCase()
      );
      if (tokenByName) {
        return tokenByName;
      }

      const tokenBySymbol = tokens.find(
        (token) => token.symbol.toLowerCase() === symbolNameOrId.toLowerCase()
      );

      const tokenById = tokens.find(
        (token) => token.id === symbolNameOrId.toLowerCase()
      );

      const fallbackToken = allTokens.find(
        (token) => token.id === symbolNameOrId.toLowerCase()
      );

      return tokenBySymbol || tokenById || fallbackToken || null;
    } catch (error) {
      console.error("Error reading token ID from symbol or name:", error);
      return null;
    }
  }

  async getTokenPriceHistory(
    tokenId: string,
    days: number = 30
  ): Promise<
    Array<{
      date: string;
      price: string;
      timestamp: number;
    }>
  > {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
      );

      if (!response.ok) {
        console.error(response);
        throw new Error("Failed to fetch price history");
      }

      const data = await response.json();
      return data.prices
        .map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price.toFixed(2),
          timestamp: timestamp,
        }))
        .sort(
          (a: { timestamp: number }, b: { timestamp: number }) =>
            a.timestamp - b.timestamp
        );
    } catch (error) {
      console.error("Error fetching token price history:", error);
      throw error;
    }
  }
}
