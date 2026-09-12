import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ImagePlus,
  Upload,
  X,
} from "lucide-react";

import {
  getReportDraft,
  saveReportDraft,
} from "@/lib/report-draft";

import "@/styles/report-item-details.css";

export function ReportItemDetailsPage() {
  const draft = getReportDraft();

  const [itemName, setItemName] = useState(
    draft.itemName,
  );

  const [category, setCategory] = useState(
    draft.category,
  );

  const [brand, setBrand] = useState(
    draft.brand,
  );

  const [color, setColor] = useState(
    draft.color,
  );

  const [description, setDescription] = useState(
    draft.description,
  );

  const [images, setImages] = useState<string[]>(
    draft.images || [],
  );

  const [error, setError] = useState("");

  /*
   * -------------------------------------------------------
   * Convert uploaded image into a smaller data URL.
   *
   * This allows the image to be temporarily stored in
   * sessionStorage and displayed on the Review page.
   * -------------------------------------------------------
   */

  async function processImage(
    file: File,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const maxSize = 1200;

          let width = image.width;
          let height = image.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height =
                (height / width) * maxSize;
              width = maxSize;
            } else {
              width =
                (width / height) * maxSize;
              height = maxSize;
            }
          }

          const canvas =
            document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const context =
            canvas.getContext("2d");

          if (!context) {
            reject(
              new Error(
                "Could not process image.",
              ),
            );

            return;
          }

          context.drawImage(
            image,
            0,
            0,
            width,
            height,
          );

          const compressed =
            canvas.toDataURL(
              "image/jpeg",
              0.75,
            );

          resolve(compressed);
        };

        image.onerror = () => {
          reject(
            new Error(
              "Could not load image.",
            ),
          );
        };

        image.src = reader.result as string;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Could not read image.",
          ),
        );
      };

      reader.readAsDataURL(file);
    });
  }

  /*
   * -------------------------------------------------------
   * Handle image selection
   * -------------------------------------------------------
   */

  async function handleImages(
    files: FileList | null,
  ) {
    if (!files) return;

    const selectedFiles =
      Array.from(files).slice(
        0,
        5 - images.length,
      );

    try {
      const processedImages =
        await Promise.all(
          selectedFiles.map(
            processImage,
          ),
        );

      const updatedImages = [
        ...images,
        ...processedImages,
      ];

      setImages(updatedImages);

      saveReportDraft({
        images: updatedImages,
      });
    } catch {
      setError(
        "One or more images could not be uploaded.",
      );
    }
  }

  /*
   * -------------------------------------------------------
   * Remove image
   * -------------------------------------------------------
   */

  function removeImage(index: number) {
    const updatedImages =
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      );

    setImages(updatedImages);

    saveReportDraft({
      images: updatedImages,
    });
  }

  /*
   * -------------------------------------------------------
   * Save + validate before going to Location
   * -------------------------------------------------------
   */

  function handleNext() {
    if (!itemName.trim()) {
      setError(
        "Please enter the name of the item.",
      );

      return;
    }

    if (!category) {
      setError(
        "Please select a category.",
      );

      return;
    }

    if (!description.trim()) {
      setError(
        "Please add a description of the item.",
      );

      return;
    }

    setError("");

    saveReportDraft({
      itemName: itemName.trim(),
      category,
      brand: brand.trim(),
      color,
      description: description.trim(),
      images,
    });
  }

  return (
    <div className="report-item-details-page">

      <main className="report-details-content">

        {/* =================================================
            INTRO
            ================================================= */}

        <section className="report-details-intro">

          <span className="report-details-eyebrow">
            LOST & FOUND
          </span>

          <h1>
            Report a Lost Item
          </h1>

          <p>
            Tell us about your item. The more details you
            provide, the easier it will be to identify it.
          </p>

        </section>

        {/* =================================================
            PROGRESS BAR
            ================================================= */}

        <div className="report-details-progress">

          <div className="details-progress-line">
            <div className="details-progress-fill" />
          </div>

          {/* Step 1 */}

          <div className="details-progress-step active">

            <span className="details-step-circle">
              1
            </span>

            <span>
              Item
            </span>

          </div>

          {/* Step 2 */}

          <div className="details-progress-step">

            <span className="details-step-circle">
              2
            </span>

            <span>
              Location
            </span>

          </div>

          {/* Step 3 */}

          <div className="details-progress-step">

            <span className="details-step-circle">
              3
            </span>

            <span>
              Details
            </span>

          </div>

          {/* Step 4 */}

          <div className="details-progress-step">

            <span className="details-step-circle">
              4
            </span>

            <span>
              Review
            </span>

          </div>

        </div>

        {/* =================================================
            FORM CARD
            ================================================= */}

        <section className="report-details-card">

          {/* =================================================
              CARD HEADER
              ================================================= */}

          <div className="report-details-header">

            <div>

              <span className="report-details-step-label">
                STEP 1
              </span>

              <h2>
                Item Details
              </h2>

              <p>
                Provide information about the item you lost.
              </p>

            </div>

            <span className="required-label">
              Required information
            </span>

          </div>

          <div className="details-divider" />

          {/* =================================================
              ITEM NAME + CATEGORY
              ================================================= */}

          <div className="details-form-grid">

            <div className="details-field">

              <label htmlFor="item-name">
                What did you lose?
                <span>*</span>
              </label>

              <input
                id="item-name"
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
                }
                placeholder="e.g. Black Leather Wallet"
              />

            </div>

            <div className="details-field">

              <label htmlFor="category">
                Category
                <span>*</span>
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="">
                  Select a category
                </option>

                <option value="Bags">
                  Bags
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Documents">
                  Documents
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Keys">
                  Keys
                </option>

                <option value="Jewellery">
                  Jewellery
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

          </div>

          {/* =================================================
              BRAND + COLOR
              ================================================= */}

          <div className="details-form-grid">

            <div className="details-field">

              <label htmlFor="brand">
                Brand
                <small>
                  Optional
                </small>
              </label>

              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) =>
                  setBrand(e.target.value)
                }
                placeholder="e.g. Apple, Nike, Ray-Ban"
              />

            </div>

            <div className="details-field">

              <label>
                Primary Color
                <span>*</span>
              </label>

              <div className="color-options">

                {[
                  {
                    name: "Black",
                    value: "#111111",
                  },
                  {
                    name: "White",
                    value: "#ffffff",
                  },
                  {
                    name: "Gray",
                    value: "#777777",
                  },
                  {
                    name: "Red",
                    value: "#e63946",
                  },
                  {
                    name: "Blue",
                    value: "#3674d9",
                  },
                ].map((colorOption) => (
                  <button
                    key={colorOption.name}
                    type="button"
                    title={colorOption.name}
                    aria-label={
                      colorOption.name
                    }
                    className={`color-button ${
                      color === colorOption.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setColor(
                        colorOption.name,
                      )
                    }
                  >
                    <span
                      style={{
                        background:
                          colorOption.value,
                      }}
                    />
                  </button>
                ))}

                <button
                  type="button"
                  className="custom-color-button"
                  onClick={() =>
                    setColor("Other")
                  }
                >
                  +
                </button>

              </div>

              <span className="selected-color">
                {color
                  ? `Selected: ${color}`
                  : "Select a color"}
              </span>

            </div>

          </div>

          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <div className="details-field full-width">

            <label htmlFor="description">
              Detailed Description
              <span>*</span>
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              placeholder="Describe any unique features, marks, damage, contents, stickers, serial numbers, or anything that can help identify your item."
              rows={5}
            />

            <span className="field-hint">
              Include details that only the real owner
              would likely know.
            </span>

          </div>

          {/* =================================================
              IMAGE UPLOAD
              ================================================= */}

          <div className="details-field full-width">

            <label>
              Upload Photos
              <small>
                Optional but recommended
              </small>
            </label>

            {images.length === 0 ? (
              <label
                htmlFor="item-images"
                className="image-upload-box"
              >

                <div className="upload-icon">
                  <Upload />
                </div>

                <strong>
                  Drag & Drop images here
                </strong>

                <span>
                  or click to browse from your device
                </span>

                <small>
                  JPG, PNG • Up to 5 images
                </small>

                <input
                  id="item-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) =>
                    handleImages(
                      e.target.files,
                    )
                  }
                />

              </label>
            ) : (
              <div className="uploaded-images">

                {images.map(
                  (image, index) => (
                    <div
                      className="uploaded-image"
                      key={`${image}-${index}`}
                    >

                      <img
                        src={image}
                        alt={`Uploaded item ${
                          index + 1
                        }`}
                      />

                      <button
                        type="button"
                        className="remove-image"
                        onClick={() =>
                          removeImage(
                            index,
                          )
                        }
                        aria-label="Remove image"
                      >
                        <X />
                      </button>

                      {index === 0 && (
                        <span className="primary-image-label">
                          Main photo
                        </span>
                      )}

                    </div>
                  ),
                )}

                {images.length < 5 && (
                  <label
                    htmlFor="more-images"
                    className="add-more-image"
                  >
                    <ImagePlus />

                    <span>
                      Add photo
                    </span>

                    <input
                      id="more-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(e) =>
                        handleImages(
                          e.target.files,
                        )
                      }
                    />
                  </label>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              ERROR
              ================================================= */}

          {error && (
            <div className="details-error">
              {error}
            </div>
          )}

          {/* =================================================
              BOTTOM
              ================================================= */}

          <div className="details-card-footer">

            <div className="privacy-note">

              <Check />

              <span>
                You can edit these details before submitting.
              </span>

            </div>

            <Link
              to="/report/location"
              onClick={handleNext}
              className="details-next-button"
            >
              <span>
                Next Step
              </span>

              <ArrowRight />

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}