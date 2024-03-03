import { Text, StyleSheet } from "react-native"

export function TextComponent ({
  children,
  opacity,
  weight,
  color,
  size,
}) {
  const styles = StyleSheet.create({
    styledText: {
      fontWeight: weight,
      opacity: opacity,
      fontSize: size,
      color: color,
    }
  })

  return <Text style={styles.styledText}>{children}</Text>
}
