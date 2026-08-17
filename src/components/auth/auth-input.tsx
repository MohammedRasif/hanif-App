import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import { cn, FieldError, InputGroup, TextField } from "heroui-native";
import React, { useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Pressable, Text, type TextInputProps, View } from "react-native";

export interface AuthInputProps<T extends FieldValues = any> extends Omit<
  TextInputProps,
  "defaultValue"
> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  containerClassName?: string;
  inputGroupClassName?: string;
  inputClassName?: string;
  isDisabled?: boolean;
}

export function AuthInput<T extends FieldValues = any>({
  control,
  name,
  label,
  errorMessage,
  placeholder,
  icon,
  isPassword = false,
  containerClassName = "mb-4",
  inputGroupClassName,
  inputClassName,
  keyboardType,
  autoCapitalize = "none",
  isDisabled = false,
  secureTextEntry,
  ...textInputProps
}: AuthInputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isSecure = isPassword ? !isPasswordVisible : secureTextEntry;

  return (
    <View className={containerClassName}>
      {label ? (
        <Text className="mb-2 font-semibold text-foreground text-sm">
          {label}
        </Text>
      ) : null}

      <TextField isInvalid={!!errorMessage}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputGroup
              className={cn(
                "relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white",
                inputGroupClassName,
              )}
              isDisabled={isDisabled}
            >
              {icon ? (
                <InputGroup.Prefix
                  className="absolute top-0 bottom-0 left-0 items-center justify-center pr-2 pl-4"
                  isDecorative
                >
                  <StyledIcons className="text-muted" name={icon} size={20} />
                </InputGroup.Prefix>
              ) : null}

              <InputGroup.Input
                autoCapitalize={autoCapitalize}
                className={cn(
                  "h-full w-full border-transparent bg-transparent text-foreground",
                  icon ? "pl-12" : "pl-4",
                  isPassword ? "pr-12" : "pr-4",
                  inputClassName,
                )}
                keyboardType={keyboardType}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#A3A3A3"
                secureTextEntry={isSecure}
                value={
                  value !== undefined && value !== null ? String(value) : ""
                }
                {...textInputProps}
              />

              {isPassword ? (
                <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                  <Pressable
                    hitSlop={12}
                    onPress={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <StyledIcons
                      className="text-muted"
                      name={
                        isPasswordVisible ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                    />
                  </Pressable>
                </InputGroup.Suffix>
              ) : null}
            </InputGroup>
          )}
        />
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
      </TextField>
    </View>
  );
}
