import { ReactNode, useCallback, useEffect, useRef } from "react";
import { Animated, Keyboard } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import { KeyboardEvent } from "react-native/Libraries/Components/Keyboard/Keyboard";

interface Props {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  children: ReactNode;
}

export function KeyboardAvoidingDialog({
  isVisible,
  setIsVisible,
  children,
}: Props) {
  // Create an animated value for translateY
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Animate to a new value with a smooth timing function
  const animateDialog = (toValue: number, duration: number) => {
    Animated.timing(translateYAnim, {
      toValue,
      duration, // adjust duration as needed
      useNativeDriver: true,
    }).start();
  };

  const handleKeyboardShow = useCallback((e: KeyboardEvent) => {
    // Move the dialog upward by 50 pixels when the keyboard appears.
    // Adjust the value as needed for your design.
    animateDialog(-(e.endCoordinates.height / 2), e.duration);
  }, []);

  const handleKeyboardHide = useCallback((e: KeyboardEvent) => {
    // Return the dialog to its original position when the keyboard hides
    animateDialog(0, e.duration);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardWillShow",
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardWillHide",
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  return (
    <Portal>
      {/* Wrap the Dialog in an Animated.View so you can animate its transform */}
      <Dialog
        style={{ transform: [{ translateY: translateYAnim }] }}
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
      >
        {children}
      </Dialog>
    </Portal>
  );
}
