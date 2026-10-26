import { v4 as uuidv4 } from "uuid";

// ponytail: BigInt UUID decimal slicing chosen for zero-dependency 9-18 digit account generation, upgrade to Luhn checksum or sequence generator if banking routing regulations require it
const generateAccountNumber = (length = 12) => {
  const digits = Math.min(Math.max(Number(length) || 12, 9), 18);
  const rawDecimal = BigInt("0x" + uuidv4().replace(/-/g, "")).toString();
  const firstDigit = (Math.floor(Math.random() * 9) + 1).toString();
  const rest = rawDecimal.slice(0, digits - 1).padEnd(digits - 1, "0");
  return `${firstDigit}${rest}`;
};

// find user account
const findUserAccount = async ({id}) => {
  return accountModel.findOne({id});
}

export { generateAccountNumber, findUserAccount };
