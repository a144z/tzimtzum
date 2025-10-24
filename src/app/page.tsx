import P5Sketch from "@/components/P5Sketch";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-auto">
      <div className="flex items-center justify-center p-2 sm:p-4 md:p-8">
        <div className="w-full h-full max-w-screen-xl">
          <P5Sketch />
        </div>
      </div>
    </div>
  );
}
