// shared/store/city.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface City {
    id: string;
    name: string;
    code: string;
}

interface CityStore {
    selectedCity: string | null;
    cities: City[];
    setSelectedCity: (cityId: string | null) => void;
    setCities: (cities: City[]) => void;
    clearSelectedCity: () => void;
}

export const useCityStore = create<CityStore>()(
    persist(
        (set) => ({
            selectedCity: null,
            cities: [],

            setSelectedCity: (cityId) => set({ selectedCity: cityId }),

            setCities: (cities) => set({
                cities: cities.filter((city, index, array) =>
                    array.findIndex(c => c.id === city.id) === index
                )
            }),

            clearSelectedCity: () => set({ selectedCity: null }),
        }),
        {
            name: 'city-storage',
            storage: createJSONStorage(() => localStorage),
            // Миграция для старых версий
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Миграция с версии 0 на 1
                    return {
                        ...persistedState,
                        cities: persistedState.cities || []
                    };
                }
                return persistedState;
            },
            version: 1,
        }
    )
);