import { useId } from "react";
import {
  FileText,
  Layers3,
  Cpu,
  Check,
  Radio,
} from "lucide-react";

export function Phone({
  index = 1,
  className = "",
  eager = false,
}: {
  index?: number;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`phone ${className}`}>
      <img
        src={`/images/reviewms-${index}.webp`}
        width="520"
        height="1127"
        alt={`ReviewMS mobil uygulaması — ${["Genel bakış", "Kartlarım", "Kart oluşturma", "Kart tarama", "Geri bildirim", "İçgörüler"][index - 1]}`}
        loading={eager ? "eager" : "lazy"}
        draggable="false"
      />
    </div>
  );
}
export function ReviewVisual({ hero = false }: { hero?: boolean }) {
  return (
    <div className={`review-visual ${hero ? "hero-review" : ""}`}>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="phone-pair">
        <Phone index={2} className="back-phone" eager={hero} />
        <Phone index={1} className="front-phone" eager={hero} />
      </div>
      <div className="nfc-card">
        <Radio size={23} />
        <span>
          Bir dokunuş.
          <br />
          Yeni bir bağlantı.
        </span>
        <b>
          ReviewMS
        </b>
      </div>
    </div>
  );
}
export function RoomVisual() {
  const floorId = useId();
  return (
    <div className="room-visual">
      <svg viewBox="0 0 500 340" aria-hidden="true" className="room-svg">
        <defs>
          <pattern
            id={floorId}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#4b7967"
              strokeWidth=".5"
            />
          </pattern>
        </defs>
        <g className="room-model">
          <path d="M70 223 250 315 430 223 250 130Z" fill="#c7dbc9" />
          <path d="M70 223 250 315 430 223 250 130Z" fill={`url(#${floorId})`} />
          <path
            d="M70 223V94L250 15V130Z"
            fill="#f6f5e9"
            stroke="#658775"
            strokeWidth="1"
          />
          <path
            d="M250 15 430 94V223L250 130Z"
            fill="#dce8d7"
            stroke="#658775"
            strokeWidth="1"
          />
          <path d="M280 57 330 80V144L280 120Z" fill="#a7bfaa" />
          <path d="M346 88 399 111V175L346 151Z" fill="#789e8d" />
          <path
            d="M130 191 219 231 302 192 214 153Z"
            fill="#f9f6e7"
            stroke="#759b81"
          />
          <path d="M130 191V220L219 262V231Z" fill="#b5c6aa" />
          <path d="M219 231 302 192V221L219 262Z" fill="#90ae98" />
          <path
            d="M146 183 185 200 212 187 173 170Z M188 202 226 219 254 205 215 188Z"
            fill="#fffef5"
          />
          <path d="M110 127V156L147 140V112Z" fill="#759b81" />
          <path d="M360 231V190" stroke="#5c7f62" strokeWidth="4" />
          <ellipse cx="360" cy="182" rx="18" ry="29" fill="#6f9170" />
          <circle cx="331" cy="251" r="18" fill="none" stroke="#234f3b" />
          <circle cx="331" cy="251" r="5" fill="#234f3b" />
        </g>
      </svg>
    </div>
  );
}
export function ScholarVisual() {
  return (
    <div className="scholar-visual">
      <div className="document-sheet">
        <div className="document-heading">
          <FileText size={19} />
          <span>araştırma.pdf</span>
          <span className="doc-badge">YEREL</span>
        </div>
        <div className="document-lines">
          <i />
          <i />
          <i className="highlight" />
          <i className="highlight" />
          <i />
          <i />
        </div>
      </div>
      <div className="answer-card">
        <div>
          <span className="ai-icon">✳</span>
          <b>Kaynağıyla birlikte.</b>
        </div>
        <p>
          Belgelerinde ara.
          <br />
          Bağlantıları keşfet.
        </p>
        <span className="citation">
          <FileText size={11} /> Kaynak belge
        </span>
      </div>
    </div>
  );
}
export function ArkunVisual() {
  return (
    <div className="arkun-visual">
      <div className="system-grid">
        <div className="system-node node-a">
          <Layers3 size={19} />
          <span>Üretim</span>
        </div>
        <div className="system-node node-b">
          <Check size={19} />
          <span>Kalite</span>
        </div>
        <div className="system-core">
          <Cpu size={34} />
          <b>ARKUN</b>
        </div>
        <div className="system-node node-c">
          <Radio size={19} />
          <span>İzlenebilirlik</span>
        </div>
        <div className="system-node node-d">
          <FileText size={19} />
          <span>Revizyon</span>
        </div>
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M65 52H200V120H335V188M335 52H200V120H65V188" />
          <path
            className="flow-line"
            d="M65 52H200V120H335V188M335 52H200V120H65V188"
          />
        </svg>
      </div>
    </div>
  );
}
