"use client";

import { useRef } from "react";
import { Select } from "@/components/ui/form";

export function StatusSelectForm({
  action,
  hiddenFields,
  name,
  defaultValue,
  options,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: Record<string, string>;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <Select
        name={name}
        defaultValue={defaultValue}
        className="w-auto py-1.5 text-xs"
        onChange={() => formRef.current?.requestSubmit()}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Select>
    </form>
  );
}
