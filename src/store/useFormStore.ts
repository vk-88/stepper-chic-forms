import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocumentData {
  fileName: string;
  fileType: 'image' | 'pdf' | '';
  file: File | null;
  fileDataUrl?: string;
}

export interface FormSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  residentialStreet1: string;
  residentialStreet2: string;
  permanentStreet1: string;
  permanentStreet2: string;
  documents: Array<{
    fileName: string;
    fileType: string;
    file: string;
  }>;
  submittedAt: string;
}

interface FormState {
  // Current step
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Personal details
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  
  // Address details
  residentialStreet1: string;
  residentialStreet2: string;
  permanentStreet1: string;
  permanentStreet2: string;
  sameAsResidential: boolean;
  
  // Documents
  documents: DocumentData[];
  
  // Actions
  setPersonalDetails: (data: { firstName: string; lastName: string; email: string; dateOfBirth: string }) => void;
  setAddressDetails: (data: { 
    residentialStreet1: string; 
    residentialStreet2: string; 
    permanentStreet1: string; 
    permanentStreet2: string;
    sameAsResidential: boolean;
  }) => void;
  setDocuments: (documents: DocumentData[]) => void;
  setSameAsResidential: (value: boolean) => void;
  
  // Submissions
  submissions: FormSubmission[];
  addSubmission: (submission: FormSubmission) => void;
  deleteSubmission: (id: string) => void;
  
  // Reset
  resetForm: () => void;
}

const initialFormState = {
  currentStep: 0,
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  residentialStreet1: '',
  residentialStreet2: '',
  permanentStreet1: '',
  permanentStreet2: '',
  sameAsResidential: false,
  documents: [
    { fileName: '', fileType: '' as const, file: null },
    { fileName: '', fileType: '' as const, file: null },
  ],
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      ...initialFormState,
      submissions: [],

      setCurrentStep: (step) => set({ currentStep: step }),

      setPersonalDetails: (data) => set({ ...data }),

      setAddressDetails: (data) => set({ ...data }),

      setDocuments: (documents) => set({ documents }),

      setSameAsResidential: (value) => set({ sameAsResidential: value }),

      addSubmission: (submission) =>
        set((state) => ({
          submissions: [...state.submissions, submission],
        })),

      deleteSubmission: (id) =>
        set((state) => ({
          submissions: state.submissions.filter((s) => s.id !== id),
        })),

      resetForm: () => set(initialFormState),
    }),
    {
      name: 'form-storage',
      partialize: (state) => ({
        submissions: state.submissions,
      }),
    }
  )
);
