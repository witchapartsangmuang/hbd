import { describe, expect, test } from "bun:test";
import { mergeContentFromForm } from "./merge-content";
import { HbdContent, SectionInstance } from "@/components/sections/utils/content-types";

function form(entries: Record<string, string> = {}): FormData {
    const fd = new FormData();
    for (const [key, value] of Object.entries(entries)) fd.set(key, value);
    return fd;
}

const SECTIONS: SectionInstance[] = [
    { id: "c1", type: "cake", enabled: true },
    { id: "c2", type: "cake", enabled: true },
    { id: "q1", type: "quizAboutYou", enabled: true },
    { id: "b1", type: "releaseBalloon", enabled: true },
    { id: "d1", type: "secretCode", enabled: true },
    { id: "g1", type: "guestbookWall", enabled: true },
];

function baseExisting(): HbdContent {
    return {
        theme: { baseColor: "#0ea5e9" },
        sections: SECTIONS,
        cake: {
            c1: { wishText: "old wish 1", wishTextAlign: "center" },
            c2: { wishText: "old wish 2", wishTextAlign: "left" },
        },
        quizAboutYou: {
            q1: { questions: [{ question: "Q", options: ["a", "b"], correctIndex: 0 }] },
        },
        releaseBalloon: {
            b1: { wishes: ["wish A", "wish B"], balloonGradients: [], balloonCount: 5 },
        },
        secretCode: {
            d1: {
                digitCount: 6,
                correctCode: "181299",
                hint: "old hint",
                revealImage: "",
                aspectRatio: "3:4",
            },
        },
        guestbookWall: {
            g1: { wishes: [{ name: "Alice", message: "HBD" }] },
        },
    };
}

describe("text fields", () => {
    test("submitted value overwrites the existing one", () => {
        const updated = mergeContentFromForm(baseExisting(), form({ "cake.c1.wishText": "new" }));
        expect(updated.cake?.c1.wishText).toBe("new");
    });

    test("an intentionally cleared field saves as empty", () => {
        const updated = mergeContentFromForm(baseExisting(), form({ "cake.c1.wishText": "" }));
        expect(updated.cake?.c1.wishText).toBe("");
    });

    test("a field absent from the form keeps the existing value", () => {
        const updated = mergeContentFromForm(baseExisting(), form());
        expect(updated.cake?.c1.wishText).toBe("old wish 1");
    });

    test("duplicate sections of the same type keep independent buckets", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "cake.c1.wishText": "only c1 changed" })
        );
        expect(updated.cake?.c1.wishText).toBe("only c1 changed");
        expect(updated.cake?.c2.wishText).toBe("old wish 2");
    });
});

describe("theme", () => {
    test("valid hex color is applied", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "theme.baseColor": "#123abc" })
        );
        expect(updated.theme?.baseColor).toBe("#123abc");
    });

    test("invalid color keeps the existing one", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "theme.baseColor": "not-a-color" })
        );
        expect(updated.theme?.baseColor).toBe("#0ea5e9");
    });
});

describe("JSON list fields (Add/Remove list UIs)", () => {
    test("an emptied list saves as empty instead of reverting", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "quizAboutYou.q1.questionsJson": "[]" })
        );
        expect(updated.quizAboutYou?.q1.questions).toEqual([]);
    });

    test("malformed JSON keeps the existing list", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "quizAboutYou.q1.questionsJson": "{oops" })
        );
        expect(updated.quizAboutYou?.q1.questions).toHaveLength(1);
    });

    test("invalid items are filtered out", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({
                "guestbookWall.g1.wishesJson": JSON.stringify([
                    { name: "Bob", message: "hi" },
                    { name: "broken" },
                ]),
            })
        );
        expect(updated.guestbookWall?.g1.wishes).toEqual([{ name: "Bob", message: "hi" }]);
    });

    test("an absent list field keeps the existing list", () => {
        const updated = mergeContentFromForm(baseExisting(), form());
        expect(updated.guestbookWall?.g1.wishes).toEqual([{ name: "Alice", message: "HBD" }]);
    });
});

describe("newline list fields", () => {
    test("an emptied textarea saves as an empty list", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "releaseBalloon.b1.wishes": "" })
        );
        expect(updated.releaseBalloon?.b1.wishes).toEqual([]);
    });

    test("lines are trimmed and blanks dropped", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "releaseBalloon.b1.wishes": "  one \n\n two " })
        );
        expect(updated.releaseBalloon?.b1.wishes).toEqual(["one", "two"]);
    });
});

describe("validated fields", () => {
    test("a correct-length secret code is applied", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "secretCode.d1.correctCode": "010203", "secretCode.d1.digitCount": "6" })
        );
        expect(updated.secretCode?.d1.correctCode).toBe("010203");
    });

    test("a wrong-length code keeps the existing one", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ "secretCode.d1.correctCode": "123", "secretCode.d1.digitCount": "6" })
        );
        expect(updated.secretCode?.d1.correctCode).toBe("181299");
    });
});

describe("sections list", () => {
    test("a valid submitted list replaces the existing order", () => {
        const reordered = [SECTIONS[1], SECTIONS[0]];
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ sections: JSON.stringify(reordered) })
        );
        expect(updated.sections?.map((s) => s.id)).toEqual(["c2", "c1"]);
    });

    test("unknown section types are dropped", () => {
        const updated = mergeContentFromForm(
            baseExisting(),
            form({
                sections: JSON.stringify([
                    ...SECTIONS,
                    { id: "x1", type: "notARealType", enabled: true },
                ]),
            })
        );
        expect(updated.sections?.some((s) => s.id === "x1")).toBe(false);
    });

    test("malformed sections JSON keeps the existing list", () => {
        const updated = mergeContentFromForm(baseExisting(), form({ sections: "{oops" }));
        expect(updated.sections).toHaveLength(SECTIONS.length);
    });

    test("removing a section drops its content bucket", () => {
        const withoutC2 = SECTIONS.filter((s) => s.id !== "c2");
        const updated = mergeContentFromForm(
            baseExisting(),
            form({ sections: JSON.stringify(withoutC2) })
        );
        expect(updated.cake?.c2).toBeUndefined();
        expect(updated.cake?.c1).toBeDefined();
    });
});

describe("share settings", () => {
    test("share fields save and clear like other text fields", () => {
        const existing = {
            ...baseExisting(),
            share: { title: "t", description: "d", imagePath: "i" },
        };
        const updated = mergeContentFromForm(
            existing,
            form({ "share.title": "new title", "share.description": "" })
        );
        expect(updated.share?.title).toBe("new title");
        expect(updated.share?.description).toBe("");
        expect(updated.share?.imagePath).toBe("i");
    });
});
