import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

export function Button({
  isLogin,
  isRegister,
  isLoading,
  children,
  onClick,
  disabled
}) {
  const buttonStyles = [
    styles.button,
    isLogin && styles.buttonLogin,
    isRegister && styles.buttonRegister,
    disabled && styles.disabledButton,
  ]

  return (
    <TouchableOpacity
      onPress={onClick}
      style={buttonStyles}
      disabled={disabled}
    >
      {!isLoading ? (
        children
      ) : (
        <ActivityIndicator size="small" color="#FFFFFF" />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 18,
    backgroundColor: 'linear-gradient(178.31deg, #0CBC8B -31.97%, rgba(12, 188, 139, 0.46) 97.77%)',
  },
  buttonLogin: {
    backgroundColor: '#FFFFFF'
  },
  buttonRegister: {
    backgroundColor: '#161616'
  },
  disabledButton: {
    backgroundColor: '#979797',
  }
})
