import type { IPopContent } from "../../service/types";

export default function Popup({ text, btnA, btnB }: IPopContent) {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 min-h-35 w-[85vw] max-w-xs flex items-center justify-center rounded-2xl shadow-2xl px-2">
      <p className="text-sm m-5 text-center">{text}</p>

      <div className="absolute bottom-2 right-4 flex justify-around gap-2">
        <button className="bg-black text-white p-0.5 px-2 rounded-2xl" onClick={btnA.action}>
          {btnA.name}
        </button>
        <button className="bg-amber-500 p-0.5 px-2 rounded-2xl" onClick={btnB.action}>
          {btnB.name}
        </button>
      </div>
    </div>
  );
}
