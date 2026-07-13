import { GiFlowerTwirl } from "react-icons/gi";

export default function MiniLoader() {
  return (
    <div className="flex items-center justify-center">
      <GiFlowerTwirl className="text-4xl m-4 text-slate-800 animate-spin" />
    </div>
  );
}
