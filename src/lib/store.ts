"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InvitationDraft {
  templateId: string | null;
  groomName: string;
  brideName: string;
  date: string; // ISO
  venue: string;
  venueMapUrl?: string;
  time: string;
  message: string;
  groomPhoto?: string;
  bridePhoto?: string;
  couplePhoto?: string;
  gallery?: string[];
  groomPhone?: string;
  brideFatherName?: string;
  groomFatherName?: string;
  brideMotherName?: string;
  groomMotherName?: string;
  storyTitle?: string;
  storyText?: string;
  voiceNote?: string;
  backgroundVideo?: string;
  enableMusic: boolean;
  musicChoice: string;
  musicUrl?: string;
}

const DEFAULT_DRAFT: InvitationDraft = {
  templateId: null,
  groomName: "",
  brideName: "",
  date: "",
  venue: "",
  time: "",
  message: "بسم الله الرحمن الرحيم، يسعدنا أن ندعوكم لحضور حفل زفافنا",
  enableMusic: true,
  musicChoice: "oud",
};

interface DraftState {
  draft: InvitationDraft;
  setField: <K extends keyof InvitationDraft>(key: K, value: InvitationDraft[K]) => void;
  setTemplate: (templateId: string) => void;
  reset: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useDraft = create<DraftState>()(
  persist(
    (set) => ({
      draft: DEFAULT_DRAFT,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setField: (key, value) =>
        set((s) => ({ draft: { ...s.draft, [key]: value } })),
      setTemplate: (templateId) =>
        set((s) => ({ draft: { ...s.draft, templateId } })),
      reset: () => set({ draft: DEFAULT_DRAFT }),
    }),
    {
      name: "zefaf-draft",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
