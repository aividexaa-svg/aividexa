export type EmailPayload = {
  platform: string;
  purpose: string;
  tone: string;
  length: string;
  context: string;
};

export type WritingPayload = string | EmailPayload;
