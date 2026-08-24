import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { MOCK_SERVICES } from "./mock-data";
import { ServiceFormView } from "./service-form-view";
import { ServiceListView } from "./service-list-view";
import type { ServiceItem, ServiceSetupProps } from "./types";

export function ServiceSetupScreen({ onBack }: ServiceSetupProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [services, setServices] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );

  const handleBack = () => {
    if (currentView === "form") {
      setCurrentView("list");
      setSelectedService(null);
    } else {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setCurrentView("form");
  };

  const handleAddNewService = () => {
    setSelectedService({
      id: Date.now().toString(),
      name: "",
      category: "Skin Care",
      description: "",
      duration: "30 min",
      price: "$50",
      staff: ["Jhon"],
    });
    setCurrentView("form");
  };

  const handleSaveService = (savedService: ServiceItem) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === savedService.id);
      if (exists) {
        return prev.map((s) => (s.id === savedService.id ? savedService : s));
      }
      return [savedService, ...prev];
    });
    setCurrentView("list");
    setSelectedService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setCurrentView("list");
    setSelectedService(null);
  };

  return (
    <View className="flex-1 bg-white">
      {currentView === "list" ? (
        <ServiceListView
          onAddNewService={handleAddNewService}
          onBack={handleBack}
          onSelectService={handleSelectService}
          services={services}
        />
      ) : (
        <ServiceFormView
          onBack={handleBack}
          onDelete={handleDeleteService}
          onSave={handleSaveService}
          service={selectedService}
        />
      )}
    </View>
  );
}
