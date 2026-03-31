import type { Messages } from "@/lib/i18n/messages";

type TranslationBranch = Messages | Messages[keyof Messages] | Record<string, unknown>;

function getValue(source: TranslationBranch, key: string) {
  return key.split(".").reduce<unknown>((currentValue, segment) => {
    if (currentValue && typeof currentValue === "object" && segment in currentValue) {
      return (currentValue as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);
}

export function createTranslator(
  messages: Messages,
  namespace?: keyof Messages
) {
  const source = namespace ? messages[namespace] : messages;

  return (key: string) => {
    const value = getValue(source, key);

    if (typeof value === "string") {
      return value;
    }

    return key;
  };
}
