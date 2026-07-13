import { GiFlowerTwirl } from "react-icons/gi";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <GiFlowerTwirl className="relative text-4xl text-white animate-spin" />
    </div>
  );
}
