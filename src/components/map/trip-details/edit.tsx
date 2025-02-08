import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Searchbar,
  useTheme,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDebounce, useDebouncedCallback } from "use-debounce";
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

  const { mutate, data, isPending } = useAddressAutocomplete();

  const [placeId, setPlaceId] = useState<string>("");
  const [input, setInput] = useState(address ?? "");

  const debounced = useDebouncedCallback((value: string) => {
    mutate(value);
  }, 300);

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
      hideDialog();
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
            autoCorrect={false}
            autoComplete="address-line1"
            value={input}
            loading={isPending}
            onChangeText={(text) => {
              setInput(text);
              debounced(text);
            }}
            placeholder={t("input.placeholder")}
            style={{ backgroundColor: colors.surfaceVariant }}
          />
        </Dialog.Content>
        <Dialog.ScrollArea style={styles.results_container}>
          <ScrollView>
            <RadioButton.Group value={placeId} onValueChange={setPlaceId}>
              {data?.predictions.map((prediction) => (
                <RadioButton.Item
                  mode="android"
                  key={prediction.place_id}
                  label={prediction.description}
                  value={prediction.place_id}
                  style={styles.place}
                />
              ))}
            </RadioButton.Group>
          </ScrollView>
        </Dialog.ScrollArea>
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
  place: {
    marginHorizontal: 8,
  },
});
