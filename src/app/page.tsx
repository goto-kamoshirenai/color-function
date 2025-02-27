export default function Home() {
  return (
    <main className="grid grid-cols-2 grid-rows-2 w-screen h-screen p-8">
      <div className="col-span-1 row-span-1 relative flex items-center justify-center bg-mono-300">
        <div className="absolute right-0 top-1/4 bottom-1/4 border-r border-black" />
        <div className="absolute left-1/4 right-1/4 bottom-0 border-b border-black" />
        1
      </div>
      <div className="col-span-1 row-span-1 relative flex items-center justify-center bg-mono-300">
        <div className="absolute left-1/4 right-1/4 bottom-0 border-b border-black" />
        2
      </div>
      <div className="col-span-1 row-span-1 relative flex items-center justify-center bg-mono-300">
        <div className="absolute right-0 top-1/4 bottom-1/4 border-r border-black" />
        3
      </div>
      <div className="col-span-1 row-span-1 relative flex items-center justify-center bg-mono-300">
        4
      </div>
    </main>
  );
}
