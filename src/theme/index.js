export const lightTheme = {
    colors: {
        primary: '#FF6B35',      // Naranja vibrante
        secondary: '#4ECDC4',    // Turquesa
        accent: '#45B7D1',       // Azul cielo
        background: '#FFFFFF',
        surface: '#F8F9FA',
        card: '#FFFFFF',
        text: '#1A1A1A',
        textSecondary: '#6C757D',
        textMuted: '#ADB5BD',
        border: '#E9ECEF',
        error: '#DC3545',
        success: '#28A745',
        warning: '#FFC107',
        info: '#17A2B8',
        gradient: ['#FF6B35', '#F7931E'],
        gradientSecondary: ['#4ECDC4', '#44A08D'],
        overlay: 'rgba(0, 0, 0, 0.5)',
        ripple: 'rgba(255, 107, 53, 0.2)',
        shadow: 'rgba(0, 0, 0, 0.1)',
        button: 'rgba(255, 255, 255, 0.2)',
    }
}

export const darkTheme = {
    colors: {
        primary: '#00c6cf',
        secondary: '#ffae2b',
        accent: '#45B7D1',
        background: '#0D1117',    // GitHub dark bg
        surface: '#161B22',       // GitHub dark surface
        card: '#21262D',          // GitHub dark card
        text: '#F0F6FC',
        textSecondary: '#8B949E',
        textMuted: '#656D76',
        border: '#30363D',
        error: '#F85149',
        success: '#56D364',
        warning: '#E3B341',
        info: '#58A6FF',
        gradient: ['#264653', '#1D3557'], // azul profundo y gris azulado
        gradientSecondary: ['#E63946', '#F1FAEE'], // rojo suave + blanco nieve
        overlay: 'rgba(0, 0, 0, 0.8)',
        ripple: 'rgba(255, 107, 53, 0.3)',
        shadow: 'rgba(0, 0, 0, 0.3)',
        button: 'rgba(255, 255, 255, 0)',
    }
}

export const typography = {
    h1: { fontSize: 32, fontWeight: '800', lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    h5: { fontSize: 18, fontWeight: '500', lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyLarge: { fontSize: 18, fontWeight: '400', lineHeight: 28 },
    bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    overline: { fontSize: 10, fontWeight: '500', lineHeight: 16, letterSpacing: 1.5 },
}

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
}

export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
}

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
}