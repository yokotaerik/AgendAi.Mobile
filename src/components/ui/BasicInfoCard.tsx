import { View, Text, StyleSheet, Image } from "react-native";
import { BasicInfoDto } from "../../types/common";
import { baseURL } from "../../api";
type Props = {
  basicInfo: BasicInfoDto;
}

// Componente para exibir funcionários
const BasicInfoCard = ({ basicInfo }: Props) => (
  <View style={styles.BasicInfoCard}>
    <Image 
      source={{ uri: baseURL +  basicInfo.imageUrl }}
      style={styles.basicInfoImage}
    />
    <Text style={styles.basicInfoName}>{basicInfo.completeName}</Text>
  </View>
);

const styles = StyleSheet.create({

  BasicInfoCard: {
    alignItems: 'center',
    width: 100,
  },
  basicInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  basicInfoName: {
    fontSize: 14,
    textAlign: 'center',
  }
});

export default BasicInfoCard;