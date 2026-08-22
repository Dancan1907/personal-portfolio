import dynamic from "next/dynamic";

// ✅ Dynamically import EVERYTHING with SSR disabled
const HomePageContent = dynamic(
  () => import("@/components/home/HomePageContent"),
  { ssr: false },
);

export default function HomePage() {
  return <HomePageContent />;
}
