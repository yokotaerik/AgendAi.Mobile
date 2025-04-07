import { tr } from "date-fns/locale";

export const theme = {
  colors: {
    primary: '#5C6BC0', // Azul lavanda sofisticado
    secondary: '#E8EAF6', // Azul muito claro
    tertiary: '#B0BEC5', // Cinza azulado
    background: '#1C1E26', // Cinza-grafite profundo (fundo mais escuro, mas não preto)
    surface: '#2A2D36', // Um pouco mais claro para cards e áreas elevadas
    text: {
      primary: '#FFFFFF', // Branco para bom contraste
      secondary: '#C5C5C5', // Cinza claro
      light: '#9E9E9E'
    },
    transparent: 'transparent',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    shadow: 'rgba(0, 0, 0, 0.4)' // Sombra mais forte pra destacar no fundo escuro
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999
  },
  typography: {
    fontFamily: {
      regular: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semiBold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold'
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32
    }
  }
};