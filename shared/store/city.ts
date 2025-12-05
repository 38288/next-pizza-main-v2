// shared/store/city.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Organization {
    id: string;
    externalId: string;
    name: string;
    code: string | null;
}

interface CityStore {
    selectedCity: string | null;
    organizations: Organization[];
    setSelectedCity: (orgId: string | null) => void;
    setOrganizations: (orgs: Organization[]) => void;
    clearSelectedCity: () => void;
}

export const useCityStore = create<CityStore>()(
    persist(
        (set) => ({
            selectedCity: null,
            organizations: [],

            setSelectedCity: (orgId) => set({ selectedCity: orgId }),

            setOrganizations: (orgs) => set({
                organizations: orgs.filter((org, index, array) =>
                    array.findIndex(o => o.externalId === org.externalId) === index
                )
            }),

            clearSelectedCity: () => set({ selectedCity: null }),
        }),
        {
            name: 'city-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);