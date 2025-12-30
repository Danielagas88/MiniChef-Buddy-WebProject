export type SetPinBody = { pin?: string };
export type VerifyPinBody = { pin?: string };

export function validatePin(pin?: string): string | null {
  if (!pin || !/^\d{4}$/.test(pin)) return null;
  return pin;
}
