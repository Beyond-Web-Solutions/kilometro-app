import {
  Button,
  Dialog,
  List,
  Portal,
  RadioButton,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import i18n from "@/lib/i18n";
import { RadioGroupField } from "@/components/_common/form/radio-group";
import { StartTripFormData } from "@/constants/definitions/trip/start";

export function LanguageSettings() {
  const { t } = useTranslation("settings", {
    keyPrefix: "appearance.language",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const handleOnLanguageSwitch = useCallback(async () => {
    await i18n.changeLanguage(language);
    setIsVisible(false);
  }, [language]);

  return (
    <>
      <List.Item
        title={t("title")}
        left={(props) => <List.Icon {...props} icon="translate" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsVisible(true)}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="translate" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.ScrollArea style={styles.scroll_area}>
            <ScrollView>
              <RadioButton.Group value={language} onValueChange={setLanguage}>
                {i18n.languages.map((lang) => (
                  <RadioButton.Item
                    key={lang}
                    style={styles.language}
                    label={t(`options.${lang}` as never)}
                    value={lang}
                  />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>{t("cancel")}</Button>
            <Button mode="contained" onPress={handleOnLanguageSwitch}>
              {t("submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll_area: {
    paddingHorizontal: 0,
  },
  language: {
    marginHorizontal: 16,
  },
});
