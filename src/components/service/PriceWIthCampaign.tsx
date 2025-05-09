import React from "react";
import { Text, View } from "react-native";
import { useCurrency } from "../../contexts/CurrencyContext";
import { ServiceDto } from "../../types/service";
import { getFinalPrice } from "../../utils/serviceDiscountHelper";

type Props = {
  service: ServiceDto;
  style : any
};

export default function PriceWithCampaign({ service, style }: Props) {
  const { format } = useCurrency();
  const hasActiveCampaign = service.campaign != null

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {hasActiveCampaign ? (
        <>
          <Text
            style={{
              textDecorationLine: "line-through",
              color: "#888",
              marginRight: 8,
            }}
          >
            {format(service.price)}
          </Text>
          <Text style={style}>
            {format(getFinalPrice(service))}
          </Text>
        </>
      ) : (
        <Text style={style}>{format(service.price)}</Text>
      )}
    </View>
  );
}
