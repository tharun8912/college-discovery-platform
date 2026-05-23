import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { College } from "@/types/college";

export const MAX_COMPARE = 3;

interface CompareState {
  selected: College[];
  toggle: (college: College) => void;
  setSelected: (colleges: College[]) => void;
  remove: (id: number) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selected: [],
      toggle: (college) => {
        const { selected } = get();
        if (selected.some((c) => c.id === college.id)) {
          set({ selected: selected.filter((c) => c.id !== college.id) });
          return;
        }
        if (selected.length >= MAX_COMPARE) return;
        set({ selected: [...selected, college] });
      },
      setSelected: (colleges) =>
        set({ selected: colleges.slice(0, MAX_COMPARE) }),
      remove: (id) =>
        set({ selected: get().selected.filter((c) => c.id !== id) }),
      clear: () => set({ selected: [] }),
      isSelected: (id) => get().selected.some((c) => c.id === id),
    }),
    { name: "campus-compass-compare-v2" }
  )
);
