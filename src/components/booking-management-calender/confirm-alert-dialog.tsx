import { StyledIcons } from "@/lib";
import { Dialog } from "heroui-native";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type IoniconName = React.ComponentProps<typeof StyledIcons>["name"];

type ConfirmAlertDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  icon?: IoniconName;
  isConfirming?: boolean;
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  title: string;
  tone?: "danger" | "success";
};

/** Small yes/no alert used before completing or cancelling a booking. */
export function ConfirmAlertDialog({
  cancelLabel = "No, go back",
  confirmLabel = "Yes, continue",
  description,
  icon = "help-circle-outline",
  isConfirming = false,
  isOpen,
  onConfirm,
  onOpenChange,
  title,
  tone = "success",
}: ConfirmAlertDialogProps) {
  const isDanger = tone === "danger";

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[88%] max-w-xs rounded-4xl bg-white p-6 shadow-2xl">
          <View
            className={`mb-4 h-14 w-14 items-center justify-center self-center rounded-full ${
              isDanger ? "bg-red-50" : "bg-emerald-50"
            }`}
          >
            <StyledIcons
              className={isDanger ? "text-[#FF3B30]" : "text-[#00C853]"}
              name={icon}
              size={30}
            />
          </View>

          <Dialog.Title className="mb-1.5 text-center font-bold text-gray-900 text-xl">
            {title}
          </Dialog.Title>
          {!!description && (
            <Text className="mb-6 text-center text-gray-500 text-sm leading-relaxed">
              {description}
            </Text>
          )}

          <View className="gap-2.5">
            <Pressable
              className={`h-13 w-full flex-row items-center justify-center gap-2 rounded-2xl ${
                isDanger
                  ? "bg-[#FF3B30] active:bg-[#e0332a]"
                  : "bg-[#00C853] active:bg-[#00b048]"
              } ${isConfirming ? "opacity-60" : ""}`}
              disabled={isConfirming}
              onPress={onConfirm}
            >
              {isConfirming && (
                <ActivityIndicator color="#FFFFFF" size="small" />
              )}
              <Text className="font-bold text-base text-white">
                {confirmLabel}
              </Text>
            </Pressable>

            <Pressable
              className="h-13 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
              disabled={isConfirming}
              onPress={() => onOpenChange(false)}
            >
              <Text className="font-semibold text-base text-gray-700">
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default ConfirmAlertDialog;
