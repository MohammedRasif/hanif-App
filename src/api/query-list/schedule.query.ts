import { kyClient } from "@/lib/ky";

export interface ScheduleBreak {
  id?: string | number;
  barber_id?: string | number;
  date?: string;
  start_time: string;
  end_time: string;
  title?: string;
}

export interface BusinessHourDay {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed?: boolean;
}

export interface BusinessHours {
  shop_id: string | number;
  hours: BusinessHourDay[];
}

export interface ScheduleShift {
  id?: string | number;
  barber_id: string | number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface ScheduleTimeOff {
  id?: string | number;
  barber_id: string | number;
  start_date: string;
  end_date: string;
  reason?: string;
  status?: string;
}

export interface ScheduleFilters {
  barber_id?: string | number;
  shop_id?: string | number;
  start_date?: string;
  end_date?: string;
}

export const scheduleApi = {
  getBreaks: (filters?: ScheduleFilters) =>
    kyClient
      .get("v1/schedule/breaks/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ScheduleBreak[]>(),

  createBreak: (data: ScheduleBreak) =>
    kyClient.post("v1/schedule/breaks/", { json: data }).json<ScheduleBreak>(),

  updateBreak: (id: string | number, data: Partial<ScheduleBreak>) =>
    kyClient
      .patch(`v1/schedule/breaks/${id}/`, { json: data })
      .json<ScheduleBreak>(),

  removeBreak: (id: string | number) =>
    kyClient.delete(`v1/schedule/breaks/${id}/`).json<void>(),

  getBusinessHours: (shop_id: string | number) =>
    kyClient
      .get(`v1/schedule/business-hours/${shop_id}/`)
      .json<BusinessHours>(),

  updateBusinessHours: (
    shop_id: string | number,
    data: Partial<BusinessHours>,
  ) =>
    kyClient
      .put(`v1/schedule/business-hours/${shop_id}/`, { json: data })
      .json<BusinessHours>(),

  getShifts: (filters?: ScheduleFilters) =>
    kyClient
      .get("v1/schedule/shifts/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ScheduleShift[]>(),

  createShift: (data: ScheduleShift) =>
    kyClient.post("v1/schedule/shifts/", { json: data }).json<ScheduleShift>(),

  updateShift: (id: string | number, data: Partial<ScheduleShift>) =>
    kyClient
      .patch(`v1/schedule/shifts/${id}/`, { json: data })
      .json<ScheduleShift>(),

  removeShift: (id: string | number) =>
    kyClient.delete(`v1/schedule/shifts/${id}/`).json<void>(),

  getTimeOff: (filters?: ScheduleFilters) =>
    kyClient
      .get("v1/schedule/time-off/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ScheduleTimeOff[]>(),

  createTimeOff: (data: ScheduleTimeOff) =>
    kyClient
      .post("v1/schedule/time-off/", { json: data })
      .json<ScheduleTimeOff>(),

  updateTimeOff: (id: string | number, data: Partial<ScheduleTimeOff>) =>
    kyClient
      .patch(`v1/schedule/time-off/${id}/`, { json: data })
      .json<ScheduleTimeOff>(),

  removeTimeOff: (id: string | number) =>
    kyClient.delete(`v1/schedule/time-off/${id}/`).json<void>(),
};
