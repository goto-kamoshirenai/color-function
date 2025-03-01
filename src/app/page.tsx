import CardContrast from "@/components/feature/card/CardContrast";
import MyColorButton from "@/components/feature/my-color/MyColorButton";
import MyColorPanel from "@/components/feature/my-color/MyColorPanel";

export default function Home() {
  return (
    <>
      <main className="flex flex-wrap w-screen p-8">
        <CardContrast />
      </main>
      <MyColorButton />
      <MyColorPanel />
    </>
  );
}
