import { View, Text, StyleSheet, Image } from "react-native";
import { CompanyDto } from "../../types/company";
import { theme } from "../../styles/theme";

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
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
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
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.tertiary,
  },
  info: {
    flex: 1,
  },
  fantasyName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  corporateName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  address: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
  },
});
