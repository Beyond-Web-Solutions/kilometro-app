import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  Text,
  useTheme,
  ButtonProps,
} from "react-native-paper";
import { ReactNode } from "react";

interface Link extends Omit<ButtonProps, "children"> {
  label: string;
}

interface Props {
  title: string;
  description: string;

  children?: ReactNode;
  showDivider?: boolean;

  links?: Link[];
}

export function OnboardAndAuthLayout({
  title,
  description,
  children,
  showDivider = true,
  links,
}: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text} variant="headlineLarge">
            {title}
          </Text>
          <Text style={styles.header_text}>{description}</Text>
        </View>
        <View style={styles.form_container}>{children}</View>
        {links && (
          <>
            {showDivider && <Divider />}
            <View style={[styles.form_container, styles.link_container]}>
              {links.map(({ label, ...props }) => (
                <Button key={label} {...props}>
                  {label}
                </Button>
              ))}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
  },
  form_container: {
    paddingHorizontal: 32,
  },
  link_container: {
    gap: 8,
    paddingVertical: 8,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 64,
    gap: 4,
  },
  header_text: {
    textAlign: "center",
  },
});
