"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { completeWorksheet, saveWorksheetField } from "@/lib/actions/worksheets";

export type FieldOption = { value: string; label: string };

export type FieldDef = {
  sectionNumber: number;
  sectionTitle: string;
  questionNumber: number;
  fieldKey: string;
  prompt: string;
  helper: string | null;
  kind: "longtext" | "shorttext" | "radio" | "date" | "blocks" | "partners" | "boolean";
  options: FieldOption[] | null;
  maxChars: number | null;
  feedsAi: boolean;
};

type Block = { time: string; activity: string; place: string };
type Partner = { name: string; role: string; contact: string };

export function WorksheetForm({
  worksheetId,
  fields,
  initial,
  lastSaved: initialLastSaved,
  completedAt,
}: {
  worksheetId: string;
  fields: FieldDef[];
  initial: Record<string, unknown>;
  lastSaved: string | null;
  completedAt: string | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [lastSaved, setLastSaved] = useState<string | null>(initialLastSaved);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [completePending, startCompleteTransition] = useTransition();
  const isLocked = !!completedAt;

  // Group fields by section.
  const sections = useMemo(() => {
    const map = new Map<number, { title: string; fields: FieldDef[] }>();
    for (const f of fields) {
      const s = map.get(f.sectionNumber) ?? { title: f.sectionTitle, fields: [] };
      s.fields.push(f);
      map.set(f.sectionNumber, s);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [fields]);

  function setValue(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function saveField(key: string, value: unknown) {
    setSavingKey(key);
    const res = await saveWorksheetField(worksheetId, key, value);
    setSavingKey(null);
    if (!("error" in res)) {
      setLastSaved(new Date().toISOString());
    }
  }

  const handleComplete = () =>
    startCompleteTransition(async () => {
      await completeWorksheet(worksheetId);
      router.refresh();
    });

  // Section completion: a section is "complete" if every required field has a value.
  function sectionState(secFields: FieldDef[]): "complete" | "in_progress" | "not_started" {
    const answered = secFields.filter((f) => fieldHasValue(values[f.fieldKey])).length;
    if (answered === 0) return "not_started";
    if (answered === secFields.length) return "complete";
    return "in_progress";
  }

  const totalAnswered = fields.filter((f) => fieldHasValue(values[f.fieldKey])).length;
  const pct = Math.round((totalAnswered / fields.length) * 100);

  return (
    <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
      {sections.map(([sec, { title, fields: secFields }]) => {
        const state = sectionState(secFields);
        return (
          <section key={sec} className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between">
              <h2 className="display text-2xl">
                {toRoman(sec)} · {title}
              </h2>
              <p
                className={`label ${
                  state === "complete"
                    ? "text-alive"
                    : state === "in_progress"
                    ? "text-fire"
                    : "text-smoke"
                }`}
              >
                {state === "complete"
                  ? "✓ Complete"
                  : state === "in_progress"
                  ? "In progress"
                  : "Not started"}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {secFields.map((f) => (
                <FieldControl
                  key={f.fieldKey}
                  field={f}
                  value={values[f.fieldKey]}
                  onChange={(v) => setValue(f.fieldKey, v)}
                  onCommit={(v) => saveField(f.fieldKey, v)}
                  saving={savingKey === f.fieldKey}
                  locked={isLocked}
                />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-void/90 backdrop-blur border-t border-cinder flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="label">
            {pct}% complete · {totalAnswered} of {fields.length} fields
          </p>
          <p className="label">
            {lastSaved ? `Autosaved · ${relativeTime(lastSaved)}` : "Not yet saved"}
            {isLocked && " · Sealed"}
          </p>
        </div>
        <div className="flex gap-3">
          {!isLocked && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={completePending || pct < 100}
              className="btn-fire"
              title={pct < 100 ? "Fill every section before sealing" : undefined}
            >
              {completePending ? "Sealing…" : "Mark complete"}
            </button>
          )}
          {isLocked && (
            <span className="label text-alive">Sealed · {relativeTime(completedAt!)}</span>
          )}
        </div>
      </footer>
    </form>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  onCommit,
  saving,
  locked,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  onCommit: (v: unknown) => void;
  saving: boolean;
  locked: boolean;
}) {
  const labelRow = (
    <div className="flex items-baseline justify-between gap-2 flex-wrap">
      <div>
        <p className="font-body text-bone">
          <span className="label mr-2">{String(field.questionNumber).padStart(2, "0")}</span>
          {field.prompt}
        </p>
        {field.helper && (
          <p className="font-body text-smoke text-sm mt-1">{field.helper}</p>
        )}
      </div>
      {field.feedsAi && <span className="label text-fire">Ask</span>}
    </div>
  );

  if (field.kind === "longtext") {
    return (
      <div className="flex flex-col gap-2">
        {labelRow}
        <LongText
          value={typeof value === "string" ? value : ""}
          maxChars={field.maxChars}
          onChange={onChange}
          onCommit={onCommit}
          locked={locked}
        />
        <SavedMeta saving={saving} value={typeof value === "string" ? value : ""} maxChars={field.maxChars} />
      </div>
    );
  }

  if (field.kind === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {labelRow}
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={locked}
                onClick={() => {
                  onChange(opt.value);
                  onCommit(opt.value);
                }}
                className={`px-4 py-2 rounded-md border text-sm font-nav uppercase tracking-wider3 transition-colors ${
                  selected
                    ? "bg-fire/15 border-fire text-bone"
                    : "border-cinder text-smoke hover:border-ash hover:text-bone"
                } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.kind === "boolean") {
    const v = typeof value === "boolean" ? value : null;
    return (
      <div className="flex flex-col gap-2">
        {labelRow}
        <div role="radiogroup" className="inline-flex rounded-md border border-cinder p-1 self-start">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ].map((opt) => {
            const selected = v === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={locked}
                onClick={() => {
                  onChange(opt.value);
                  onCommit(opt.value);
                }}
                className={`min-w-[64px] px-4 py-1.5 rounded text-xs font-nav uppercase tracking-wider3 transition-colors ${
                  selected
                    ? opt.value
                      ? "bg-fire text-bone"
                      : "bg-ash text-bone"
                    : "text-smoke hover:text-bone"
                } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.kind === "date") {
    return (
      <div className="flex flex-col gap-2">
        {labelRow}
        <input
          type="date"
          className="input-shell"
          value={typeof value === "string" ? value : ""}
          disabled={locked}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onBlur={(e) => onCommit(e.target.value)}
        />
      </div>
    );
  }

  if (field.kind === "blocks") {
    return (
      <div className="flex flex-col gap-2">
        {labelRow}
        <BlocksEditor
          value={Array.isArray(value) ? (value as Block[]) : []}
          onChange={onChange}
          onCommit={onCommit}
          locked={locked}
        />
      </div>
    );
  }

  if (field.kind === "partners") {
    return (
      <div className="flex flex-col gap-2">
        {labelRow}
        <PartnersEditor
          value={Array.isArray(value) ? (value as Partner[]) : []}
          onChange={onChange}
          onCommit={onCommit}
          locked={locked}
        />
      </div>
    );
  }

  // shorttext fallback
  return (
    <div className="flex flex-col gap-2">
      {labelRow}
      <input
        className="input-shell"
        value={typeof value === "string" ? value : ""}
        disabled={locked}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onCommit(e.target.value)}
      />
    </div>
  );
}

function LongText({
  value,
  maxChars,
  onChange,
  onCommit,
  locked,
}: {
  value: string;
  maxChars: number | null;
  onChange: (v: string) => void;
  onCommit: (v: string) => void;
  locked: boolean;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <textarea
      className="input-shell min-h-[120px] resize-y font-body leading-relaxed"
      value={value}
      disabled={locked}
      maxLength={maxChars ?? undefined}
      onChange={(e) => {
        onChange(e.target.value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const v = e.target.value;
        timeoutRef.current = setTimeout(() => onCommit(v), 800);
      }}
      onBlur={(e) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onCommit(e.target.value);
      }}
    />
  );
}

function SavedMeta({
  saving,
  value,
  maxChars,
}: {
  saving: boolean;
  value: string;
  maxChars: number | null;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="label">{saving ? "Saving…" : value ? "Saved" : "Not yet written"}</p>
      {maxChars && (
        <p className="label">
          {value.length} / {maxChars}
        </p>
      )}
    </div>
  );
}

function BlocksEditor({
  value,
  onChange,
  onCommit,
  locked,
}: {
  value: Block[];
  onChange: (v: Block[]) => void;
  onCommit: (v: Block[]) => void;
  locked: boolean;
}) {
  const blocks = value.length ? value : [];

  const update = (i: number, patch: Partial<Block>) => {
    const next = blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    onChange(next);
  };
  const commit = (next: Block[]) => {
    onChange(next);
    onCommit(next);
  };
  const addRow = () => commit([...blocks, { time: "", activity: "", place: "" }]);
  const removeRow = (i: number) => commit(blocks.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b, i) => (
        <div key={i} className="grid grid-cols-12 gap-2">
          <input
            className="input-shell col-span-3"
            placeholder="5:30A"
            value={b.time}
            disabled={locked}
            onChange={(e) => update(i, { time: e.target.value })}
            onBlur={() => onCommit(blocks)}
          />
          <input
            className="input-shell col-span-5"
            placeholder="Prayer + scripture"
            value={b.activity}
            disabled={locked}
            onChange={(e) => update(i, { activity: e.target.value })}
            onBlur={() => onCommit(blocks)}
          />
          <input
            className="input-shell col-span-3"
            placeholder="Office · 60 min"
            value={b.place}
            disabled={locked}
            onChange={(e) => update(i, { place: e.target.value })}
            onBlur={() => onCommit(blocks)}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            disabled={locked}
            aria-label="Remove block"
            className="col-span-1 label text-smoke hover:text-fire transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
      {!locked && (
        <button type="button" onClick={addRow} className="btn-ghost self-start">
          + Add time block
        </button>
      )}
    </div>
  );
}

function PartnersEditor({
  value,
  onChange,
  onCommit,
  locked,
}: {
  value: Partner[];
  onChange: (v: Partner[]) => void;
  onCommit: (v: Partner[]) => void;
  locked: boolean;
}) {
  const partners = value.length ? value : [];
  const update = (i: number, patch: Partial<Partner>) => {
    const next = partners.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    onChange(next);
  };
  const commit = (next: Partner[]) => {
    onChange(next);
    onCommit(next);
  };
  const add = () => commit([...partners, { name: "", role: "", contact: "" }]);
  const remove = (i: number) => commit(partners.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {partners.map((p, i) => (
        <div key={i} className="grid grid-cols-12 gap-2">
          <input
            className="input-shell col-span-4"
            placeholder="Name"
            value={p.name}
            disabled={locked}
            onChange={(e) => update(i, { name: e.target.value })}
            onBlur={() => onCommit(partners)}
          />
          <input
            className="input-shell col-span-3"
            placeholder="Spouse / mentor / friend"
            value={p.role}
            disabled={locked}
            onChange={(e) => update(i, { role: e.target.value })}
            onBlur={() => onCommit(partners)}
          />
          <input
            className="input-shell col-span-4"
            placeholder="Phone or email"
            value={p.contact}
            disabled={locked}
            onChange={(e) => update(i, { contact: e.target.value })}
            onBlur={() => onCommit(partners)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={locked}
            aria-label="Remove partner"
            className="col-span-1 label text-smoke hover:text-fire transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
      {!locked && (
        <button type="button" onClick={add} className="btn-ghost self-start">
          + Add partner
        </button>
      )}
    </div>
  );
}

function fieldHasValue(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.some((x) => fieldHasValue(x));
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).some(fieldHasValue);
  return true;
}

function toRoman(n: number) {
  return ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"][n] ?? String(n);
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.max(1, Math.round((now - then) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}
