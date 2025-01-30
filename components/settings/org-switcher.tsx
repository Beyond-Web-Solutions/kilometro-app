import { Dialog, Portal } from "react-native-paper";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
}

export function OrganizationSwitcher({ isVisible, hideDialog }: Props) {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Title>This is a title</Dialog.Title>
      </Dialog>
    </Portal>
  );
}
