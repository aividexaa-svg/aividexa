"use client";

import Link from "next/link";

export default function TermsCheckbox({
  checked,
  onChange,
  required = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 text-sm text-white/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-1 accent-white"
      />

      <span className="leading-relaxed">
        I agree to the{" "}
        <Link href="/terms" className="underline text-white">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline text-white">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
