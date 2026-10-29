import { apiFetch } from "./api";
import type { LostFoundItem } from "@/data/items";
import type { ReportDraft } from "./report-draft";

type SupabaseItemRow = {
  id: string | number;
  title: string;
  type: string;
  description: string;
  category: string;
  location: string;
  image_urls: string[] | null;
  created_at: string;
};

export async function getItems(): Promise<LostFoundItem[]> {
  const { items } = await apiFetch<{ items: SupabaseItemRow[] }>("/api/items", null);

  return items.map((row) => {
    if (row.type !== "lost" && row.type !== "found") {
      throw new Error(`Unexpected item type "${row.type}" in the items table.`);
    }

    return {
      id: row.id,
      title: row.title,
      type: row.type === "lost" ? "Lost" : "Found",
      description: row.description,
      category: row.category,
      location: row.location,
      date: new Date(row.created_at)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase(),
      image: row.image_urls?.[0] ?? "",
    };
  });
}

export async function uploadItemImage(dataUrl: string, token: string) {
  const { publicUrl } = await apiFetch<{ publicUrl: string }>(
    "/api/items/image",
    token,
    { method: "POST", body: JSON.stringify({ dataUrl }) },
  );
  return publicUrl;
}

export async function submitReport(draft: ReportDraft, token: string) {
  if (
    !draft.itemName.trim() ||
    !draft.category.trim() ||
    !draft.description.trim() ||
    !draft.location.trim() ||
    !draft.city.trim() ||
    !draft.dateLost
  ) {
    throw new Error("Complete the item details and location before submitting.");
  }

  if (
    draft.verificationQuestions.length < 5 ||
    draft.verificationQuestions.length > 15
  ) {
    throw new Error("Add between 5 and 15 ownership verification questions.");
  }

  // Images pehle backend se upload hongi, phir unke URLs report ke saath jaayenge
  const imageUrls: string[] = [];
  for (const dataUrl of draft.images) {
    imageUrls.push(await uploadItemImage(dataUrl, token));
  }

  return apiFetch<{ id: string }>("/api/items", token, {
    method: "POST",
    body: JSON.stringify({
      item: {
        title: draft.itemName.trim(),
        type: "lost",
        category: draft.category.trim(),
        brand: draft.brand.trim(),
        color: draft.color.trim(),
        description: draft.description.trim(),
        location: draft.location.trim(),
        city: draft.city.trim(),
        area: draft.area.trim(),
        date_lost: draft.dateLost,
        approx_time: draft.approxTime,
        latitude: draft.latitude,
        longitude: draft.longitude,
        image_urls: imageUrls,
      },
      verificationQuestions: draft.verificationQuestions,
    }),
  });
}