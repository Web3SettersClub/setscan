import axios from "axios";
import { APP_CONFIGURATION } from "../utils/config";

const SETM_DENOM = "setheum-network";

interface Price {
  usd: number;
  usd_24h_change: number;
}

interface PriceWrapper {
  [coin: string]: Price;
}

export const authenticationToken = async (token: string): Promise<boolean> => await axios
  .get(`https://www.google.com/recaptcha/api/siteverify?secret=${APP_CONFIGURATION.recaptchaSecret}&response=${token}`)
  .then((res) => res.data.success)
  .catch((err) => {
    console.log(err);
    throw new Error("Can not extract recaptcha token...")
  });

export const getSetheumPrice = async (): Promise<Price> => axios
  .get<PriceWrapper>(`https://api.coingecko.com/api/v3/simple/price?ids=${SETM_DENOM}&vs_currencies=usd&include_24hr_change=true`)
  .then((res) => res.data[SETM_DENOM])
  .then((res) => ({...res}))
  .catch((err) => {
    console.log(err);
    throw new Error("Can not extract setheum price from coingecko...")
  });
  