export const compareWalletAddress = (addr1?: string, addr2?: string): boolean => {
  return addr1?.toLowerCase() === addr2?.toLowerCase();
};
