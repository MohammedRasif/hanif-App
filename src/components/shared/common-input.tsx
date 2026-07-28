import { cn, FieldError, InputGroup, Label, TextField } from "heroui-native";
import React from "react";
import type { TextInputProps } from "react-native";
import { Text, View } from "react-native";

export interface CommonInputProps extends TextInputProps {
  containerClassName?: string;
  errorClassName?: string;
  errorMessage?: string;
  field?: any;
  helperText?: string;
  inputClassName?: string;
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
  containerClassName = "mb-3",
  inputGroupClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  className,
  placeholder,
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
    <View className={containerClassName}>
      <TextField
        className={className}
        isDisabled={isDisabled}
        isInvalid={invalid}
        isRequired={isRequired}
      >
        {label && (
          <Label
            className={cn(
              "mb-1 font-semibold text-foreground text-xs",
              labelClassName,
            )}
          >
            {label}
          </Label>
        )}

        <InputGroup
          className={cn(
            "h-12 w-full flex-row items-center rounded-xl border border-default-200 bg-white px-3.5",
            invalid && "border-danger",
            isDisabled && "opacity-50",
            inputGroupClassName,
          )}
        >
          {prefix && (
            <InputGroup.Prefix className="mr-2">{prefix}</InputGroup.Prefix>
          )}

          <InputGroup.Input
            className={cn(
              "h-full flex-1 bg-transparent text-foreground text-sm",
              inputClassName,
            )}
            isDisabled={isDisabled}
            onBlur={inputOnBlur}
            onChangeText={inputOnChange}
            placeholder={placeholder}
            placeholderTextColor="#A3A3A3"
            value={inputValue}
            {...restProps}
          />

          {suffix && (
            <InputGroup.Suffix className="ml-2">{suffix}</InputGroup.Suffix>
          )}
        </InputGroup>

        {errorText ? (
          <FieldError
            className={cn("mt-1 text-danger text-xs", errorClassName)}
          >
            {errorText}
          </FieldError>
        ) : helperText ? (
          <Text className="mt-1 text-default-400 text-xs">{helperText}</Text>
        ) : null}
      </TextField>
    </View>
  );
}
