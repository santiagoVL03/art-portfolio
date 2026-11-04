// Usamos la API de React Native pero el build compila a react-native-web.
// @types/react-native-web solo declara StyleSheet como tipo, así que agregamos
// el valor (el paquete real sí lo exporta en runtime).
declare module 'react-native' {
  export * from 'react-native-web';
  export const StyleSheet: import('react-native-web').StyleSheet;
}
