import { useCurrency } from "../contexts/CurrencyContext";
import { ServiceDto } from "../types/service";

export function getFinalPrice(item: ServiceDto): number {

    const discount = (item.price * item.campaign!.percentage) / 100;
    return item.price - discount;
  }


