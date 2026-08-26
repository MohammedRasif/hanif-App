import { getUserData } from "@/lib/storage";
import { useGetShopServicesQuery } from "@/Redux/feature/shop";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { ServiceFormView } from "./service-form-view";
import { ServiceListView } from "./service-list-view";
import type { ServiceItem, ServiceSetupProps } from "./types";

export function ServiceSetupScreen({ onBack }: ServiceSetupProps) {
  const router = useRouter();

  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 1;

  // 📡 GET /v1/services/?shop=<shop_id>
  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    refetch,
  } = useGetShopServicesQuery(shopId, { refetchOnMountOrArgChange: true });

  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Transform API response (Returns [] if no data, NO mock data fallback!)
  const services: ServiceItem[] = useMemo(() => {
    if (servicesResponse?.data && Array.isArray(servicesResponse.data)) {
      return servicesResponse.data.map((s: any) => ({
        id: String(s.id),
        name: s.name,
        category: s.category?.name || "Hair Care",
        description: s.description || "",
        duration: `${s.duration_minutes || 30} min`,
        price: `$${s.price || "0.00"}`,
        staff: s.barbers || [],
      }));
    }
    return [];
  }, [servicesResponse]);

  const handleBack = () => {
    if (currentView === "form") {
      setCurrentView("list");
      setSelectedService(null);
      refetch();
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
    setSelectedService(null);
    setCurrentView("form");
  };

  const handleSaveService = async (_savedService: ServiceItem) => {
    setIsSyncing(true);
    setCurrentView("list");
    setSelectedService(null);
    try {
      await refetch();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteService = async (_serviceId: string) => {
    setIsSyncing(true);
    setCurrentView("list");
    setSelectedService(null);
    try {
      await refetch();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {currentView === "list" ? (
        <ServiceListView
          isLoading={isServicesLoading || isSyncing}
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
