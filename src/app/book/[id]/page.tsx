import { notFound } from "next/navigation";
import style from "./page.module.css";
import { BookData, ReviewData } from "@/types";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";
import Image from "next/image";

//아래 설정을 하면, id가 1,2,3 외에 값은 모두 404 not found페이지가 호출됨
//export const dynamicParams = false;

//getStaticPath(페이지라우팅)의 AppRouter버전임
export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const books: BookData[] = await response.json();

  return books.map((book) => ({
    id: book.id.toString(),
  })); //주의사항: id값을 문자열로만 써야함
}

async function BookDetail({ bookId }: { bookId: string }) {
  //GenerateStaticParams라는 함수를 내보내 주시게 되면 페이지 컴퍼넌트 내부에
  // 데이터 캐싱이 설정되지 않은 이러한 데이터 페칭인 fetch가 존재하게 될지라도 무조건 해당하는
  // 페이지가 static 페이지로서 강제로 설정이 된다는 점
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    return <div>오류가 발생했습니다...</div>;
  }

  const book = await response.json();

  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
    book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image
          src={coverImgUrl}
          width={240}
          height={300}
          alt={`도서 ${title}의 표지 이미지`}
        />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

//props에서 params만 꺼내서 쓰기 위해 파라미터 첫번째와 같이 설정
//params는 Promise 객체임
//함수나 컴포넌트, 혹은 어떤 변수의 값이 "나중에 비동기적으로 도착"할 예정이라면 그 타입은 Promise<T>로 정의
//이 Promise가 나중에 { id: string | string[] }라는 객체 하나를 반환함 -> 이 객체 안에 있는 id라는 키의 값은 문자열(string) 혹은 문자열배열임(string{})

//아래 코드는 Next.js 15 이전버전에서는 잘되었으나, 15부터 params와 searchParams는 지연평가되어 아래처럼 처리하면안됨
// export default function Page({ params }: { params: { id: string } }) {
//   return (
//     <div className={style.container}>
//       <BookDetail bookId={params.id} />
//       <ReviewEditor />
//     </div>
//   );
// }

// 해결책1
// export default async function Page(props: { params: Promise<{ id: string }> }) {
//   const { id } = await props.params;

//   return (
//     <div className={style.container}>
//       <BookDetail bookId={id} />
//       <ReviewEditor />
//     </div>
//   );
// }

async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}
    `
    // { next: { tags: [`review-${bookId}`] } } //create-review.action.tsx에서 revalidate와 관련
  );

  if (!response.ok) {
    throw new Error(`Review fetch failed : ${response.statusText}`);
  }

  const reviews: ReviewData[] = await response.json();

  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem key={`review-item-${review.id}`} {...review} />
      ))}
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const book: BookData = await response.json();

  return {
    title: `${book.title} - 한입북스`,
    description: `${book.description}`,
    openGraph: {
      title: `${book.title} - 한입북스`,
      description: `${book.description}`,
      images: [book.coverImgUrl],
    },
  };
}

// 해결책2
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className={style.container}>
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
      <ReviewList bookId={id} />
    </div>
  );
}
