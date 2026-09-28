"use client";

import { useId, useState } from "react";
import { mails } from "./mail";

// Share of the morning's mail that needed only an approval (a ready draft) or
// nothing at all: on Kirpi's morning, 5 of 8.
const handled = mails.filter((m) => m.tray === "hazir" || m.tray === "dokunma").length;
const SHARE = handled / mails.length;
const DAYS = 6; // a workshop week

const fmt = (n: number, digits = 1) => n.toLocaleString("tr-TR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-[15px] font-semibold" htmlFor={id}>
          {label}
        </label>
        <output className="font-[family-name:var(--kp-mono)] text-sm tabular-nums" htmlFor={id}>
          {value} {unit}
        </output>
      </div>
      <input
        className="mt-3 w-full accent-[var(--kp-ink)]"
        id={id}
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <div aria-hidden="true" className="mt-1 flex justify-between font-[family-name:var(--kp-mono)] text-[11px] text-[var(--kp-muted)]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

/** A rough weekly estimate for the visitor's own inbox, with its sum in plain sight. */
export function Savings() {
  const [perDay, setPerDay] = useState(40);
  const [minutes, setMinutes] = useState(4);
  const hours = (perDay * minutes * SHARE * DAYS) / 60;

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-[var(--kp-line)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-8 bg-[var(--kp-panel)] p-6 sm:p-10">
        <Slider label="Günde gelen e-posta" max={150} min={5} onChange={setPerDay} step={5} unit="adet" value={perDay} />
        <Slider label="Birine harcanan süre" max={10} min={1} onChange={setMinutes} step={1} unit="dk" value={minutes} />
        <p className="text-sm leading-6 text-[var(--kp-muted)]">
          Kirpi&apos;nin sabahında {mails.length} e-postanın {handled}&apos;i sizden yalnızca bir onay istedi ya da hiçbir şey istemedi. Hesap bu oranı (%{Math.round(SHARE * 100)}) ve haftada {DAYS} iş gününü
          kullanır.
        </p>
      </div>
      <div aria-live="polite" className="flex flex-col justify-between gap-10 bg-[var(--kp-glaze)] p-6 text-white sm:p-10">
        <p className="text-[15px] text-white/80">Haftada geri kazandığınız zaman, kabaca</p>
        <p className="font-[family-name:var(--kp-display)] leading-none font-semibold tracking-[-0.04em]">
          <span className="text-[clamp(4rem,9vw,7rem)] tabular-nums">{fmt(hours)}</span> <span className="text-3xl">saat</span>
        </p>
        <p className="font-[family-name:var(--kp-mono)] text-[12px] leading-5 text-white/75">
          {perDay} e-posta × {minutes} dk × %{Math.round(SHARE * 100)} × {DAYS} gün ≈ {fmt(hours)} saat
          <br />
          Ayda yaklaşık {fmt((hours * 4.3) / 8)} iş günü.
        </p>
      </div>
    </div>
  );
}
