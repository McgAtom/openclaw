import { describe, expect, it } from "vitest";
import manifest from "../../../../extensions/memory-core/openclaw.plugin.json";
import { registerSettingsEnglish } from "../../i18n/locales/en-settings.ts";
import { curatedSettingsPresentation } from "./curated-settings-presentation.ts";

const presentation = curatedSettingsPresentation("memory-dreaming-settings");

describe("Memory Core settings placement presentation", () => {
  it("owns every curated field without changing its runtime schema", () => {
    expect(presentation.presentationOwner).toBe(manifest.id);
    const seen = new Set<string>();
    for (const section of presentation.sections) {
      for (const field of section.fields) {
        const path = field.path.join(".");
        expect(seen.has(path)).toBe(false);
        seen.add(path);
        const schema = field.path.reduce(
          (node, part) => node.properties[part],
          manifest.configSchema.properties.dreaming,
        );
        if (field.kind === "number") {
          expect(field.bounds).toEqual({
            integer: schema.type === "integer",
            min: schema.minimum,
            ...(schema.maximum === undefined ? {} : { max: schema.maximum }),
          });
        }
        if (field.kind === "segmented") {
          expect(field.options.map((option) => option.value)).toEqual(schema.enum);
          expect(schema.enum).toContain(field.displayDefault);
        }
        for (const key of [field.labelKey, field.helpKey]) {
          const label = key
            .split(".")
            .reduce<unknown>(
              (value, part) =>
                value && typeof value === "object" ? Reflect.get(value, part) : undefined,
              registerSettingsEnglish.catalog,
            );
          expect(typeof label).toBe("string");
          expect(label).not.toBe("");
        }
      }
    }
    expect(seen.size).toBe(22);
  });
});
