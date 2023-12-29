import Link from "next/link";

const header = () => {
  return (
    <header className="sticky top-0 w-full border-b z-10 bg-white">
      <div className="mx-0 flex justify-between items-center h-12 px-10">
        <Link className="font-bold" href="/">TOP</Link>
        <Link className="font-bold" href="https://ut-orientation.net/24/visitor/">ウェブサイト</Link>
      </div>
    </header>
  );
};

export default header;