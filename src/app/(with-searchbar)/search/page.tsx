import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";

import { Metadata } from "next";
import { Suspense } from "react";

// 서치페이지를 강제 스태틱설정시, 쿼리스트링에 의존하고 있는 이 페이지는 검색기능이 마비됨
// 강제 static설정시, 아래 동적함수의 searchParams의 값은 빈값으로 설정됨
//export const dynamic = "force-static";

async function SearchResult({ q }: { q: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }

  const books: BookData[] = await response.json();

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

// 현재 이 코드가 문제가 되는 이유 정리
// export default function Page({
//   searchParams,
// }: {
//   searchParams: {
//     q?: string;
//   };
// }) {
//   return (
//     <Suspense
//       key={searchParams.q || ""}
//       fallback={<BookListSkeleton count={3} />}
//     >
//       <SearchResult q={searchParams.q || ""} />
//     </Suspense>
//   );
// }

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  // 현재 페이지의 메타 데이터를 동적으로 생성하는 역할을 함
  const { q } = await searchParams;
  return {
    title: `${q} : 한입북스`,
    description: `${q}의 검색결과입니다`,
    openGraph: {
      title: `${q} : 한입북스`,
      description: `${q}의 검색결과입니다`,
      images: [`${process.env.NEXT_PUBLIC_URL_KJM}/thumbnail.png`],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>; //
}) {
  const params = await searchParams;

  return (
    <Suspense key={params.q || ""} fallback={<BookListSkeleton count={3} />}>
      <SearchResult q={params.q || ""} />
    </Suspense>
  );
}
