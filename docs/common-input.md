# CommonInput Component Documentation

The `CommonInput` component ([`src/components/shared/common-input.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/components/shared/common-input.tsx)) is a reusable, lightweight text input built for the **Barbers Bay** mobile application.

It integrates seamlessly with **HeroUI Native** (`TextField`, `Label`, `InputGroup`, `FieldError`) and **Uniwind / Tailwind CSS** for flexible, elegant, and consistent form styling.

---

## Features

- 🎨 **HeroUI Native Design**: Native micro-animations, tokens, and accessible form structures.
- 💅 **Tailwind CSS Styling**: Rounded corners (`rounded-2xl`), clean borders, and custom HSL color tokens.
- ⚡ **Lightweight & Fast**: Zero unnecessary abstractions or complex internal state.
- 🏷️ **Labels & Messages**: Built-in support for top labels, bottom error messages, and helper text.
- 🔌 **Prefix & Suffix Support**: Built-in slots for icons (e.g., search icon, email icon, password eye toggle).
- 🔄 **Form Library Compatible**: Works out-of-the-box with `useState`, `react-hook-form`, or `@tanstack/react-form`.

---

## Import Path

Import directly from `@/components/shared`:

```tsx
import { CommonInput } from "@/components/shared";
```

---

## Component API Props

`CommonInput` extends all standard React Native `TextInputProps` (`keyboardType`, `secureTextEntry`, `autoCapitalize`, `maxLength`, `autoFocus`, etc.) and adds the following props:

| Prop                  | Type                     | Default     | Description                                                                             |
| :-------------------- | :----------------------- | :---------- | :-------------------------------------------------------------------------------------- |
| `label`               | `string`                 | `undefined` | Label text displayed above the input box.                                               |
| `placeholder`         | `string`                 | `undefined` | Placeholder text shown when input is empty.                                             |
| `value`               | `string`                 | `undefined` | Controlled text value of the input.                                                     |
| `onChangeText`        | `(text: string) => void` | `undefined` | Callback fired when user types in input.                                                |
| `onBlur`              | `() => void`             | `undefined` | Callback fired when input loses focus.                                                  |
| `errorMessage`        | `string`                 | `undefined` | Error text displayed below input in red (`text-danger`). Triggers error border styling. |
| `helperText`          | `string`                 | `undefined` | Helper / description text displayed below input when there is no error.                 |
| `isRequired`          | `boolean`                | `false`     | Displays an asterisk or required indicator on the label.                                |
| `isDisabled`          | `boolean`                | `false`     | Disables user interaction and reduces opacity.                                          |
| `isInvalid`           | `boolean`                | `undefined` | Forcefully marks input as invalid. Automatically `true` if `errorMessage` is provided.  |
| `prefix`              | `React.ReactNode`        | `undefined` | Slot for prefix icons or text inside the input box (e.g. search icon).                  |
| `suffix`              | `React.ReactNode`        | `undefined` | Slot for suffix icons or action buttons inside the input box (e.g. eye toggle).         |
| `containerClassName`  | `string`                 | `"mb-4"`    | Tailwind classes for outer container `<View>`.                                          |
| `inputGroupClassName` | `string`                 | `undefined` | Custom Tailwind classes for `<InputGroup>` wrapper box.                                 |
| `inputClassName`      | `string`                 | `undefined` | Custom Tailwind classes for `<InputGroup.Input>`.                                       |
| `labelClassName`      | `string`                 | `undefined` | Custom Tailwind classes for `<Label>`.                                                  |
| `errorClassName`      | `string`                 | `undefined` | Custom Tailwind classes for `<FieldError>`.                                             |

---

## Usage Examples

### 1. Basic Input

```tsx
import { CommonInput } from "@/components/shared";
import React, { useState } from "react";
import { View } from "react-native";

export function ProfileNameForm() {
  const [fullName, setFullName] = useState("John Doe");

  return (
    <View className="px-6 py-4">
      <CommonInput
        label="Full Name"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />
    </View>
  );
}
```

---

### 2. Input with Validation Error

When `errorMessage` is passed, `CommonInput` automatically highlights the border in red (`border-danger`) and renders the `<FieldError>` text below the input box.

```tsx
import { CommonInput } from "@/components/shared";
import React, { useState } from "react";

export function EmailInputExample() {
  const [email, setEmail] = useState("invalid-email");
  const [error, setError] = useState("Please enter a valid email address");

  return (
    <CommonInput
      label="Email Address"
      placeholder="Plant@gmail.com"
      keyboardType="email-address"
      autoCapitalize="none"
      value={email}
      onChangeText={(text) => {
        setEmail(text);
        if (text.includes("@")) {
          setError("");
        } else {
          setError("Please enter a valid email address");
        }
      }}
      errorMessage={error}
    />
  );
}
```

---

### 3. Password Input with Suffix Eye Toggle

```tsx
import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { Pressable } from "react-native";

export function PasswordInputExample() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <CommonInput
      label="Password"
      placeholder="••••••••"
      secureTextEntry={!showPassword}
      value={password}
      onChangeText={setPassword}
      suffix={
        <Pressable hitSlop={12} onPress={() => setShowPassword(!showPassword)}>
          <StyledIcons
            className="text-default-400"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
          />
        </Pressable>
      }
    />
  );
}
```

---

### 4. Input with Icon Prefix (Search / Phone)

```tsx
import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import React, { useState } from "react";

export function SearchInputExample() {
  const [search, setSearch] = useState("");

  return (
    <CommonInput
      label="Search Salons"
      placeholder="Search by shop name or location..."
      value={search}
      onChangeText={setSearch}
      prefix={
        <StyledIcons className="text-default-400" name="search" size={18} />
      }
    />
  );
}
```

---

### 5. Helper Text & Required Indicator

```tsx
<CommonInput
  label="Phone Number"
  placeholder="0156614612"
  keyboardType="phone-pad"
  isRequired
  helperText="We will send appointment updates via SMS."
/>
```

---

### 6. Integration with Form Libraries

#### Integration with `react-hook-form` / `Controller`

```tsx
import { CommonInput } from "@/components/shared";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export function ContactForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { email: "" },
  });

  return (
    <View>
      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <CommonInput
            label="Email"
            placeholder="Plant@gmail.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={error?.message}
          />
        )}
      />
    </View>
  );
}
```

---

## Styling Architecture

`CommonInput` uses the semantic color tokens provided by **HeroUI Native**:

- **Border**: `border border-default-200`
- **Error Border**: `border-danger`
- **Label**: `font-semibold text-foreground text-sm`
- **Placeholder**: `#A3A3A3`
- **Input Height**: `h-14` (56px touch target compliant)
- **Container Radius**: `rounded-2xl`

All styles can be easily overridden via `inputGroupClassName`, `inputClassName`, `containerClassName`, `labelClassName`, or `errorClassName`.
