
import { supabase } from "./supabase";
import type { LostFoundItem } from "@/data/items";
import type { ReportDraft } from "./report-draft";

type SupabaseItemRow = {
  id: string | number;
  title: string;
  type: string;
  description: string;
  category: string;
  location: string;
  image_url: string | null;
  created_at: string;
};

export async function getItems(): Promise<LostFoundItem[]> {
  const { data, error } = await supabase
    .from("items")
    .select("id, title, type, description, category, location, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as SupabaseItemRow[]).map((row) => {
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
      image: row.image_url ?? "",
    };
  });
}

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Please log in before reporting an item.");

  return user;
}

function fileFromDataUrl(dataUrl: string, index: number): File {
  const [metadata, encoded] = dataUrl.split(",");
  const mimeType = metadata?.match(/^data:(image\/[\w.+-]+);base64$/)?.[1];

  if (!mimeType || !encoded) {
    throw new Error("A report image could not be read. Please upload it again.");
  }

  const bytes = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0),
  );

  return new File([bytes], `report-image-${index + 1}`, {
    type: mimeType,
  });
}

async function uploadImage(file: File, userId: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Each image must be 5 MB or smaller.");
  }

  const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("item-images")
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("item-images").getPublicUrl(path);

  return { path, publicUrl: data.publicUrl };
}

export async function submitReport(draft: ReportDraft) {
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

  const user = await getAuthenticatedUser();
  const uploadedImages: Array<{ path: string; publicUrl: string }> = [];

  try {
    for (const [index, image] of draft.images.entries()) {
      uploadedImages.push(
        await uploadImage(fileFromDataUrl(image, index), user.id),
      );
    }

    const { data, error } = await supabase.rpc("create_lost_found_report", {
      p_item: {
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
        image_urls: uploadedImages.map((image) => image.publicUrl),
      },
      p_verification_questions: draft.verificationQuestions,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    if (uploadedImages.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from("item-images")
        .remove(uploadedImages.map((image) => image.path));

      if (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          "The report could not be saved and uploaded images could not be cleaned up.",
        );
      }
    }

    throw error;
  }
}

export async function uploadItemImage(file: File) {
  const user = await getAuthenticatedUser();
  const { publicUrl } = await uploadImage(file, user.id);
  return publicUrl;
}
