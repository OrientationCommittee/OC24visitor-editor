import Link from "next/link";

const header = () => {
  return (
    <header className="sticky top-0 w-full z-10 bg-white">
      <div className="mx-0 flex justify-between items-center h-12 px-10 py-10">
        <Link className="font-bold text-2xl" href="/">
          visitor-editor
        </Link>
        <Link
          className="ml-auto bg-blue-600 text-white text-sm px-7 py-3 font-semibold rounded"
          href="https://ut-orientation.net/24/visitor/"
        >
          visitor
        </Link>
        <Link
          className="ml-6 bg-green-600 text-white text-sm px-7 py-3 font-semibold rounded"
          href="/new"
        >
          新規記事
        </Link>
      </div>
    </header>
  );
};

export default header;
