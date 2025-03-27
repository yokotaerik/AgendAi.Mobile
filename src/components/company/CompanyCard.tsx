import { View, Text, StyleSheet, Image } from "react-native";
import { CompanyDto } from "../../types/company";

interface CompanyCardProps {
  company: CompanyDto;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <View style={styles.container}>
      {company.imageUrl && (
        <Image source={{ uri: company.imageUrl }} style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.fantasyName}>{company.fantasyName}</Text>

        <Text style={styles.corporateName}>{company.corporateName}</Text>

        {company.address && (
          <Text style={styles.address}>
            {company.address.street}, {company.address.number}
            {"\n"}
            {company.address.city} - {company.address.state}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  fantasyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  corporateName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#999",
  },
});
