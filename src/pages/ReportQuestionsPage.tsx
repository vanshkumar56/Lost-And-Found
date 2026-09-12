import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  getReportDraft,
  saveReportDraft,
  type VerificationQuestion,
} from "@/lib/report-draft";

import "@/styles/report-questions.css";

/* =========================================================
   CATEGORIES
   ========================================================= */

const CATEGORIES = [
  "Phone",
  "Laptop",
  "Bag",
  "Wallet",
  "Bottle",
  "ID Card",
  "Earphones",
  "Watch",
  "Keys",
  "Other",
];

/* =========================================================
   QUESTION BANK
   ========================================================= */

const QUESTION_BANK: Record<string, string[]> = {
  Phone: [
    "What was the phone's primary color?",
    "What type of phone case was on it?",
    "What was visible on the lock screen?",
    "How many camera lenses were visible?",
    "What type of screen protector was used?",
    "What was attached to the phone?",
    "What was distinctive about the phone case?",
    "Which side had a visible mark or scratch?",
    "What charging connector did it use?",
    "What was the wallpaper on the phone?",
    "Was there a sticker on the phone or case?",
    "What type of camera arrangement did it have?",
    "What was the approximate storage capacity?",
    "What accessory was attached to the phone?",
    "What was the phone's distinctive physical feature?",
  ],

  Laptop: [
    "What was the laptop's primary color?",
    "What type of finish did the laptop have?",
    "What was visible on the laptop lid?",
    "What color was the keyboard?",
    "What type of charger did it use?",
    "How many stickers were visible?",
    "What color was the laptop sleeve?",
    "Did it have a numeric keypad?",
    "Which side had the most visible ports?",
    "What was attached to the laptop?",
    "What type of laptop sleeve was used?",
    "What was distinctive about the keyboard?",
  ],

  Bag: [
    "What was the bag's primary color?",
    "What type of bag was it?",
    "How many main compartments did it have?",
    "What was the zipper color?",
    "What was attached to the bag?",
    "What material was the bag made from?",
    "What color were the straps?",
    "Where was the external pocket?",
    "What was inside the bag?",
    "What was distinctive about the bag?",
    "What type of closure did it have?",
  ],

  Wallet: [
    "What was the wallet's primary color?",
    "What material was the wallet made from?",
    "How many card slots were visible?",
    "What type of wallet was it?",
    "Was there a coin compartment?",
    "What color was the stitching?",
    "What was inside the wallet?",
    "Was there a photo inside?",
    "What was distinctive about the wallet?",
  ],

  Bottle: [
    "What was the bottle's primary color?",
    "What material was the bottle made from?",
    "What type of cap did it have?",
    "What was written on the bottle?",
    "What shape was the bottle?",
    "What size was the bottle approximately?",
    "Was there a sticker on it?",
    "What color was the cap?",
    "What was distinctive about the bottle?",
  ],

  "ID Card": [
    "What type of ID card was it?",
    "What was the card's background color?",
    "What type of holder was used?",
    "What color was the card holder?",
    "Was the card laminated?",
    "Was there a lanyard attached?",
    "What color was the lanyard?",
    "What was printed on the back?",
    "What was distinctive about the card holder?",
  ],

  Earphones: [
    "What was the primary color?",
    "Were they wired or wireless?",
    "What type of charging case did they have?",
    "What color was the charging case?",
    "What shape was the charging case?",
    "Was there a visible scratch?",
    "What was attached to the case?",
    "What type of ear tips were used?",
    "What was distinctive about the earphones?",
    "What was printed on the case?",
  ],

  Watch: [
    "What was the watch's primary color?",
    "What type of strap did it have?",
    "What color was the strap?",
    "Was it analog or digital?",
    "What shape was the dial?",
    "What was visible on the watch face?",
    "What material was the strap?",
    "Was there a scratch on the screen?",
    "What was distinctive about the watch?",
  ],

  Keys: [
    "How many keys were on the keyring?",
    "What color was the keyring?",
    "What type of keychain was attached?",
    "What color was the keychain?",
    "Was there a car key?",
    "Was there a house key?",
    "What shape was the keychain?",
    "Was there a tag attached?",
    "What was distinctive about the keyring?",
  ],

  Other: [
    "What was the item's primary color?",
    "What material was the item made from?",
    "What was the item's approximate size?",
    "Was there a visible mark or scratch?",
    "What was attached to the item?",
    "What was the item's distinctive feature?",
    "What was the item's shape?",
    "What was written on the item?",
    "Where was the identifying mark?",
    "What accessory was with the item?",
  ],
};

/* =========================================================
   GET QUESTION BANK SAFELY
   ========================================================= */

function getQuestionBank(
  category: string,
): string[] {
  return (
    QUESTION_BANK[category] ??
    QUESTION_BANK["Other"] ??
    [
      "What was the item's primary color?",
      "What material was the item made from?",
      "What was the item's distinctive feature?",
      "What was attached to the item?",
      "What was the approximate size of the item?",
    ]
  );
}

/* =========================================================
   CREATE QUESTION
   ========================================================= */

function createQuestion(
  question: string,
  index: number,
): VerificationQuestion {
  return {
    id: `${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2)}`,

    question,

    options: [
      "",
      "",
      "",
      "",
      "",
    ],

    correctAnswer: 0,
  };
}

/* =========================================================
   PAGE
   ========================================================= */

export function ReportQuestionsPage() {
  const navigate = useNavigate();

  const draft = getReportDraft();

  const [category, setCategory] =
    useState<string>(
      draft.category || "",
    );

  const [questionCount, setQuestionCount] =
    useState<number>(
      Math.min(
        Math.max(
          draft.verificationQuestions?.length ||
            5,
          5,
        ),
        15,
      ),
    );

  const [questions, setQuestions] =
    useState<VerificationQuestion[]>(
      draft.verificationQuestions?.length
        ? draft.verificationQuestions
        : [],
    );

  const [showThanks, setShowThanks] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     AVAILABLE QUESTIONS
     ======================================================= */

  const availableQuestions = useMemo(
    () => getQuestionBank(category),
    [category],
  );

  /* =======================================================
     CATEGORY CHANGE
     ======================================================= */

  function handleCategoryChange(
    value: string,
  ) {
    setCategory(value);

    setError("");

    const bank =
      getQuestionBank(value);

    const initialQuestions =
      bank
        .slice(0, questionCount)
        .map(
          (
            question,
            index,
          ) =>
            createQuestion(
              question,
              index,
            ),
        );

    setQuestions(
      initialQuestions,
    );
  }

  /* =======================================================
     QUESTION COUNT CHANGE
     ======================================================= */

  function handleQuestionCountChange(
    count: number,
  ) {
    setQuestionCount(count);

    setError("");

    const bank =
      getQuestionBank(category);

    setQuestions((current) => {
      const updated = [
        ...current,
      ];

      while (
        updated.length < count
      ) {
        const questionText =
          bank[
            updated.length %
              bank.length
          ] ??
          "What is a distinctive feature of this item?";

        updated.push(
          createQuestion(
            questionText,
            updated.length,
          ),
        );
      }

      return updated.slice(
        0,
        count,
      );
    });
  }

  /* =======================================================
     UPDATE QUESTION
     ======================================================= */

  function updateQuestionText(
    questionIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map(
        (
          question,
          index,
        ) =>
          index ===
          questionIndex
            ? {
                ...question,
                question: value,
              }
            : question,
      ),
    );
  }

  /* =======================================================
     UPDATE OPTION
     ======================================================= */

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map(
        (
          question,
          index,
        ) => {
          if (
            index !==
            questionIndex
          ) {
            return question;
          }

          const options = [
            ...question.options,
          ];

          options[
            optionIndex
          ] = value;

          return {
            ...question,
            options,
          };
        },
      ),
    );
  }

  /* =======================================================
     SELECT CORRECT ANSWER
     ======================================================= */

  function updateCorrectAnswer(
    questionIndex: number,
    optionIndex: number,
  ) {
    setQuestions((current) =>
      current.map(
        (
          question,
          index,
        ) =>
          index ===
          questionIndex
            ? {
                ...question,
                correctAnswer:
                  optionIndex,
              }
            : question,
      ),
    );
  }

  /* =======================================================
     ADD OPTION
     ======================================================= */

  function addOption(
    questionIndex: number,
  ) {
    setQuestions((current) =>
      current.map(
        (
          question,
          index,
        ) => {
          if (
            index !==
            questionIndex
          ) {
            return question;
          }

          if (
            question.options
              .length >= 5
          ) {
            return question;
          }

          return {
            ...question,

            options: [
              ...question.options,
              "",
            ],
          };
        },
      ),
    );
  }

  /* =======================================================
     REMOVE OPTION
     ======================================================= */

  function removeOption(
    questionIndex: number,
    optionIndex: number,
  ) {
    setQuestions((current) =>
      current.map(
        (
          question,
          index,
        ) => {
          if (
            index !==
            questionIndex
          ) {
            return question;
          }

          if (
            question.options
              .length <= 2
          ) {
            return question;
          }

          const options =
            question.options.filter(
              (
                _,
                i,
              ) =>
                i !==
                optionIndex,
            );

          let correctAnswer =
            question.correctAnswer;

          if (
            optionIndex ===
            correctAnswer
          ) {
            correctAnswer = 0;
          } else if (
            optionIndex <
            correctAnswer
          ) {
            correctAnswer--;
          }

          return {
            ...question,
            options,
            correctAnswer,
          };
        },
      ),
    );
  }

  /* =======================================================
     VALIDATE QUESTIONS
     ======================================================= */

  function validateQuestions(): boolean {
    if (!category) {
      setError(
        "Please select the item category.",
      );

      return false;
    }

    if (
      questions.length < 5
    ) {
      setError(
        "Please add at least 5 verification questions.",
      );

      return false;
    }

    if (
      questions.length > 15
    ) {
      setError(
        "You can have a maximum of 15 questions.",
      );

      return false;
    }

    for (
      let i = 0;
      i < questions.length;
      i++
    ) {
      const question =
        questions[i];

      if (!question) {
        setError(
          `Question ${
            i + 1
          } could not be loaded.`,
        );

        return false;
      }

      if (
        !question.question.trim()
      ) {
        setError(
          `Please enter Question ${
            i + 1
          }.`,
        );

        return false;
      }

      const validOptions =
        question.options.filter(
          (
            option,
          ) =>
            option.trim() !== "",
        );

      if (
        validOptions.length <
        2
      ) {
        setError(
          `Question ${
            i + 1
          } needs at least 2 options.`,
        );

        return false;
      }

      const correctOption =
        question.options[
          question.correctAnswer
        ];

      if (
        !correctOption ||
        !correctOption.trim()
      ) {
        setError(
          `Please select the correct answer for Question ${
            i + 1
          }.`,
        );

        return false;
      }
    }

    return true;
  }

  /* =======================================================
     SUBMIT
     ======================================================= */

  function handleSubmit() {
    const valid =
      validateQuestions();

    if (!valid) {
      return;
    }

    saveReportDraft({
      category,

      verificationQuestions:
        questions,
    });

    setError("");

    setShowThanks(true);
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="report-questions-page">

      <main className="questions-container">

        {/* HEADER */}

        <header className="questions-header">

          <div>

            <span className="questions-eyebrow">
              OWNERSHIP VERIFICATION
            </span>

            <h1>
              Create Verification Questions
            </h1>

            <p>
              Add questions that only the real owner
              should be able to answer.
            </p>

          </div>

          <div className="question-count-badge">
            {questions.length} Questions
          </div>

        </header>


        {/* SECURITY WARNING */}

        <section className="security-warning">

          <div className="warning-icon">
            <AlertTriangle />
          </div>

          <div>

            <strong>
              Don't reveal identifying details
            </strong>

            <p>
              Do not reveal the brand, model, serial
              number, IMEI, password, or other unique
              identifying information in your public
              item description.
            </p>

            <span>
              Keep those details private and use them
              only as ownership verification questions.
            </span>

          </div>

        </section>


        {/* SETUP */}

        <section className="question-setup-card">

          <div className="setup-heading">

            <div className="setup-number">
              01
            </div>

            <div>

              <h2>
                Choose your item
              </h2>

              <p>
                We'll suggest questions based on
                your selected category.
              </p>

            </div>

          </div>


          <div className="setup-controls">

            {/* CATEGORY */}

            <div className="setup-field">

              <label>
                What product is it?
              </label>

              <div className="select-wrapper">

                <select
                  value={category}
                  onChange={(e) =>
                    handleCategoryChange(
                      e.target.value,
                    )
                  }
                >

                  <option value="">
                    Select product category
                  </option>

                  {CATEGORIES.map(
                    (
                      item,
                    ) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ),
                  )}

                </select>

                <ChevronDown />

              </div>

            </div>


            {/* QUESTION COUNT */}

            <div className="setup-field">

              <label>
                Number of questions
              </label>

              <div className="question-count-selector">

                <input
                  type="range"
                  min="5"
                  max="15"
                  value={
                    questionCount
                  }
                  onChange={(e) =>
                    handleQuestionCountChange(
                      Number(
                        e.target.value,
                      ),
                    )
                  }
                />

                <div className="question-count-value">
                  {questionCount}
                </div>

              </div>

              <span className="field-hint">
                Choose between 5 and 15 questions.
              </span>

            </div>

          </div>

        </section>


        {/* QUESTIONS */}

        {category && (
          <section className="questions-section">

            <div className="questions-section-header">

              <div>

                <span>
                  VERIFICATION QUESTIONS
                </span>

                <h2>
                  Tell us what only the owner knows
                </h2>

              </div>

              <div className="mcq-badge">
                MCQ
              </div>

            </div>


            <div className="questions-list">

              {questions.map(
                (
                  question,
                  questionIndex,
                ) => (

                  <article
                    className="question-card"
                    key={
                      question.id
                    }
                  >

                    {/* QUESTION */}

                    <div className="question-card-header">

                      <div className="question-number">
                        {String(
                          questionIndex +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      <div className="question-heading">

                        <span>
                          QUESTION{" "}
                          {questionIndex +
                            1}
                        </span>

                        <input
                          type="text"
                          value={
                            question.question
                          }
                          onChange={(
                            e,
                          ) =>
                            updateQuestionText(
                              questionIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Enter your verification question"
                        />

                      </div>

                    </div>


                    {/* OPTIONS TITLE */}

                    <div className="options-heading">

                      <span>
                        Answer Options
                      </span>

                      <small>
                        Select the correct answer
                      </small>

                    </div>


                    {/* OPTIONS */}

                    <div className="options-list">

                      {question.options.map(
                        (
                          option,
                          optionIndex,
                        ) => (

                          <div
                            className={`option-row ${
                              question.correctAnswer ===
                              optionIndex
                                ? "correct"
                                : ""
                            }`}
                            key={
                              optionIndex
                            }
                          >

                            <button
                              type="button"
                              className="correct-selector"
                              onClick={() =>
                                updateCorrectAnswer(
                                  questionIndex,
                                  optionIndex,
                                )
                              }
                              aria-label={`Mark option ${
                                optionIndex +
                                1
                              } as correct`}
                            >

                              {question.correctAnswer ===
                              optionIndex ? (
                                <Check />
                              ) : (
                                <span />
                              )}

                            </button>


                            <span className="option-letter">
                              {String.fromCharCode(
                                65 +
                                  optionIndex,
                              )}
                            </span>


                            <input
                              type="text"
                              value={
                                option
                              }
                              onChange={(
                                e,
                              ) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value,
                                )
                              }
                              placeholder={`Option ${
                                optionIndex +
                                1
                              }`}
                            />


                            {question.options
                              .length >
                              2 && (

                              <button
                                type="button"
                                className="remove-option"
                                onClick={() =>
                                  removeOption(
                                    questionIndex,
                                    optionIndex,
                                  )
                                }
                                aria-label="Remove option"
                              >

                                <Trash2 />

                              </button>

                            )}

                          </div>

                        ),
                      )}

                    </div>


                    {/* ADD OPTION */}

                    {question.options
                      .length < 5 && (

                      <button
                        type="button"
                        className="add-option-button"
                        onClick={() =>
                          addOption(
                            questionIndex,
                          )
                        }
                      >

                        <Plus />

                        Add option

                        <span>
                          {
                            question
                              .options
                              .length
                          }
                          /5
                        </span>

                      </button>

                    )}


                    {/* CORRECT ANSWER */}

                    <div className="correct-answer-info">

                      <Check />

                      <span>
                        Click the circle beside an option
                        to mark it as the correct answer.
                      </span>

                    </div>

                  </article>

                ),
              )}

            </div>

          </section>
        )}


        {/* EMPTY STATE */}

        {!category && (

          <section className="questions-empty">

            <div className="empty-icon">
              <ShieldCheck />
            </div>

            <h2>
              Choose an item category
            </h2>

            <p>
              Select what was lost above and we'll
              prepare relevant ownership questions for you.
            </p>

          </section>

        )}


        {/* ERROR */}

        {error && (

          <div className="questions-error">

            <AlertTriangle />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ACTIONS */}

        <div className="questions-actions">

          <button
            type="button"
            className="questions-back"
            onClick={() =>
              navigate({
                to: "/report/review",
              })
            }
          >

            <ArrowLeft />

            Back

          </button>


          <button
            type="button"
            className="questions-submit"
            onClick={
              handleSubmit
            }
          >

            <ShieldCheck />

            Submit Lost Item

          </button>

        </div>

      </main>


      {/* SUCCESS MODAL */}

      {showThanks && (

        <div className="thanks-overlay">

          <div className="thanks-modal">

            <div className="thanks-icon">
              <Check />
            </div>

            <span className="thanks-eyebrow">
              REPORT SUBMITTED
            </span>

            <h2>
              Thank you!
            </h2>

            <p>
              Your lost item has been reported
              successfully.
            </p>

            <p className="thanks-small">
              Your verification questions will remain
              private and will only be used to confirm
              ownership.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/dashboard",
                })
              }
              className="thanks-button"
            >
              Back to Home
            </button>

          </div>

        </div>

      )}

    </div>
  );
}