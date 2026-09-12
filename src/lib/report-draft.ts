/* =========================================================
   VERIFICATION QUESTION
   ========================================================= */

export interface VerificationQuestion {
  id: string;

  question: string;

  /*
   * Maximum 5 options per question.
   */
  options: string[];

  /*
   * Index of the correct option.
   *
   * Example:
   * options = ["Black", "Blue", "Red"]
   * correctAnswer = 1
   *
   * means "Blue" is correct.
   */
  correctAnswer: number;
}


/* =========================================================
   REPORT DRAFT
   ========================================================= */

export interface ReportDraft {
  /* -------------------------
     Item Details
     ------------------------- */

  itemName: string;

  category: string;

  brand: string;

  color: string;

  description: string;


  /* -------------------------
     Location Details
     ------------------------- */

  location: string;

  city: string;

  area: string;

  dateLost: string;

  approxTime: string;


  /* -------------------------
     Exact Map Location
     ------------------------- */

  latitude: number | null;

  longitude: number | null;


  /* -------------------------
     Uploaded Images
     ------------------------- */

  images: string[];


  /* -------------------------
     Old / General Question
     ------------------------- */

  question: string;


  /* -------------------------
     Ownership Verification
     ------------------------- */

  verificationQuestions: VerificationQuestion[];
}


/* =========================================================
   EMPTY REPORT
   ========================================================= */

const emptyDraft: ReportDraft = {
  /* -------------------------
     Item Details
     ------------------------- */

  itemName: "",

  category: "",

  brand: "",

  color: "",

  description: "",


  /* -------------------------
     Location Details
     ------------------------- */

  location: "",

  city: "",

  area: "",

  dateLost: "",

  approxTime: "",


  /* -------------------------
     Map Coordinates
     ------------------------- */

  latitude: null,

  longitude: null,


  /* -------------------------
     Images
     ------------------------- */

  images: [],


  /* -------------------------
     Old Question
     ------------------------- */

  question: "",


  /* -------------------------
     Verification Questions
     ------------------------- */

  verificationQuestions: [],
};


/* =========================================================
   STORAGE KEY
   ========================================================= */

const STORAGE_KEY =
  "findback-report-draft";


/* =========================================================
   GET REPORT DRAFT
   ========================================================= */

export function getReportDraft(): ReportDraft {
  /*
   * sessionStorage only exists in the browser.
   */

  if (
    typeof window ===
    "undefined"
  ) {
    return {
      ...emptyDraft,
    };
  }


  const saved =
    sessionStorage.getItem(
      STORAGE_KEY,
    );


  /*
   * Nothing has been saved yet.
   */

  if (!saved) {
    return {
      ...emptyDraft,
    };
  }


  try {
    const parsed =
      JSON.parse(saved);


    /*
     * Merge the saved data with
     * emptyDraft.
     *
     * This protects the app if we
     * add new fields in the future.
     */

    return {
      ...emptyDraft,
      ...parsed,

      /*
       * Make sure verificationQuestions
       * is always an array.
       */

      verificationQuestions:
        Array.isArray(
          parsed.verificationQuestions,
        )
          ? parsed.verificationQuestions
          : [],

      /*
       * Make sure images is always
       * an array.
       */

      images:
        Array.isArray(
          parsed.images,
        )
          ? parsed.images
          : [],
    };
  } catch {
    /*
     * If the stored data is corrupted,
     * start with a clean draft.
     */

    return {
      ...emptyDraft,
    };
  }
}


/* =========================================================
   SAVE REPORT DRAFT
   ========================================================= */

export function saveReportDraft(
  updates: Partial<ReportDraft>,
) {
  /*
   * Get the existing report.
   */

  const current =
    getReportDraft();


  /*
   * Merge old + new data.
   */

  const updated: ReportDraft = {
    ...current,
    ...updates,
  };


  /*
   * Save everything into sessionStorage.
   */

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated),
  );


  /*
   * Return the updated report
   * so the caller can use it immediately.
   */

  return updated;
}


/* =========================================================
   CLEAR REPORT DRAFT
   ========================================================= */

export function clearReportDraft() {
  if (
    typeof window !==
    "undefined"
  ) {
    sessionStorage.removeItem(
      STORAGE_KEY,
    );
  }
}