import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Searchbar,
  useTheme,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import { useCallback, useEffect, useState } from "react";
import { useAddressAutocomplete } from "@/src/hooks/geo/address-autocomplete";
import { ScrollView, StyleSheet } from "react-native";

interface Props {
  address: string | null;
  isVisible: boolean;
  hideDialog: () => void;

  callback: (placeId: string, address: string) => void;
}

export function EditTripDetailsDialog({
  address,
  isVisible,
  hideDialog,
  callback,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("map", { keyPrefix: "edit-trip-details" });
  const { mutate, data } = useAddressAutocomplete();

  const [placeId, setPlaceId] = useState<string>("");

  const [input, setInput] = useState(address ?? "");
  const [q] = useDebounce(input, 300);

  useEffect(() => {
    if (q !== address) {
      mutate(q);
    }
  }, [q, address]);

  const handleOnDismiss = useCallback(() => {
    hideDialog();
    setInput(address ?? "");
  }, [hideDialog]);

  const handleOnConfirm = useCallback(() => {
    if (!data) return;

    const newAddress = data?.predictions.find(
      (prediction) => prediction.place_id === placeId,
    )?.description;

    if (newAddress) {
      callback(placeId, newAddress);
    }
  }, [data, placeId, callback]);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={handleOnDismiss}>
        <Dialog.Icon icon="map-marker" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            autoFocus
            autoComplete="address-line1"
            autoCorrect={false}
            placeholder={t("input.placeholder")}
            value={input}
            onChangeText={setInput}
            style={{ backgroundColor: colors.surfaceVariant }}
          />

          <Dialog.ScrollArea style={styles.results_container}>
            <ScrollView>
              <RadioButton.Group value={placeId} onValueChange={setPlaceId}>
                {data?.predictions.map((prediction) => (
                  <RadioButton.Item
                    mode="android"
                    key={prediction.place_id}
                    label={prediction.description}
                    value={prediction.place_id}
                  />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleOnDismiss}>{t("cancel")}</Button>
          <Button
            mode="contained"
            disabled={!placeId}
            onPress={handleOnConfirm}
          >
            {t("submit")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  results_container: {
    paddingHorizontal: 0,
    marginTop: 8,
  },
});
