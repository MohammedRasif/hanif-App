import { cn } from "heroui-native";
import type { PropsWithChildren, ReactNode } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewProps,
} from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = ViewProps & {
  className?: string;
  isScrollable?: boolean;
  keyboardAvoiding?: boolean;
  safeAreaBottom?: boolean;
  scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle">;
};

export function Container({
  children,
  className,
  isScrollable = true,
  keyboardAvoiding = false,
  safeAreaBottom = false,
  scrollViewProps,
  style,
  ...props
}: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();

  let content: ReactNode;
  if (isScrollable) {
    if (keyboardAvoiding) {
      content = (
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={{ flexGrow: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </KeyboardAwareScrollView>
      );
    } else {
      content = (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      );
    }
  } else if (keyboardAvoiding) {
    content = (
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        {children}
      </KeyboardAvoidingView>
    );
  } else {
    content = <View className="flex-1">{children}</View>;
  }

  return (
    <View
      className={cn("flex-1 bg-background", className)}
      style={[
        {
          paddingBottom: safeAreaBottom ? insets.bottom : 0,
        },
        style,
      ]}
      {...props}
    >
      {content}
    </View>
  );
}
