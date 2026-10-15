// Shared camera, photo, and file entry points for chat and New Session.
import type { ChatAttachmentControlsProps } from "./chat-attachment-controls.types.ts";
import { appendChatAttachmentFiles } from "./chat-attachments.ts";

export function clickComposerInput(target: HTMLElement, selector: string) {
  target
    .closest(".agent-chat__composer-shell, .new-session-page__composer")
    ?.querySelector<HTMLInputElement>(selector)
    ?.click();
}

export function handleChatAttachmentFileSelect(e: Event, props: ChatAttachmentControlsProps) {
  const input = e.target;
  if (!(input instanceof HTMLInputElement)) {
    return;
  }
  const files = [...(input.files ?? [])];
  input.value = "";
  appendChatAttachmentFiles(files, props);
}

export function handleChatAttachmentMenuSelection(target: HTMLElement, value: string): boolean {
  if (value !== "camera" && value !== "photo" && value !== "file") {
    return false;
  }
  if (value === "camera") {
    target
      .closest(".agent-chat__composer-shell, .new-session-page__composer")
      ?.querySelector("openclaw-chat-camera-capture")
      ?.show();
  } else {
    clickComposerInput(target, `.agent-chat__${value}-input`);
  }
  return true;
}
