import { cn } from "heroui-native";
import React from "react";
import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

export interface CommonInputProps extends TextInputProps {
  containerClassName?: string;
  errorClassName?: string;
  errorMessage?: string;
  field?: any;
  helperText?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  inputGroupClassName?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  label?: string;
  labelClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function CommonInput({
  field,
  label,
  errorMessage,
  helperText,
  isRequired = false,
  isDisabled = false,
  isInvalid,
  prefix,
  suffix,
  containerClassName = "mb-3.5",
  inputContainerClassName,
  inputGroupClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  className,
  placeholder,
  placeholderTextColor = "#9CA3AF",
  value,
  onChangeText,
  onBlur,
  ...restProps
}: CommonInputProps) {
  // If `field` from TanStack Form is passed, extract value, handlers, and errors automatically
  const inputValue = field ? String(field.state.value ?? "") : (value ?? "");
  const inputOnChange = field
    ? (text: string) => field.handleChange(text)
    : onChangeText;
  const inputOnBlur = field ? () => field.handleBlur() : onBlur;

  const fieldError = field?.state.meta.isTouched
    ? field?.state.meta.errors?.[0]
    : undefined;
  const errorText =
    errorMessage ||
    (typeof fieldError === "string"
      ? fieldError
      : (fieldError as any)?.message);

  const invalid = isInvalid ?? Boolean(errorText);

  return (
    <View className={cn("w-full", containerClassName, className)}>
      {label && (
        <Text
          className={cn(
            "mb-1.5 font-medium text-sm text-gray-700",
            labelClassName,
          )}
        >
          {label}
          {isRequired && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <View
        className={cn(
          "h-13 w-full flex-row items-center rounded-2xl border border-gray-200 bg-white px-4",
          invalid && "border-red-500",
          isDisabled && "opacity-50 bg-gray-50",
          inputGroupClassName,
          inputContainerClassName,
        )}
      >
        {prefix && <View className="mr-2.5">{prefix}</View>}

        <TextInput
          className={cn(
            "h-full flex-1 text-sm text-gray-900 py-0",
            inputClassName,
          )}
          editable={!isDisabled}
          onBlur={inputOnBlur}
          onChangeText={inputOnChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={inputValue}
          {...restProps}
        />

        {suffix && <View className="ml-2.5">{suffix}</View>}
      </View>

      {errorText ? (
        <Text className={cn("mt-1 text-red-500 text-xs", errorClassName)}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text className="mt-1 text-gray-400 text-xs">{helperText}</Text>
      ) : null}
    </View>
  );
}
