"use server";

import { delay } from "@/util/delay";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createReviewAction(_: any, formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!bookId || !content || !author) {
    return {
      status: false,
      error: "리뷰 내용과 작성자를 입력해주세요",
    };
  }

  try {
    await delay(2000);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({ bookId, content, author }),
      }
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    //넥스트서버측에게 페이지를 다시 생성하도록 요청해서 서버액션의 결과를 바로 화면에 나타나게함
    //오직 서버측에서만 호출함 revalidatePath -> 해당 페이지를 재생성하면서 데이터캐싱이 force-cache더라도 다 삭제됨, 풀라우트 캐시도 삭제됨

    //1. 특정주소의 해당하는 페이지만 재검증
    // revalidatePath(`/book/${bookId}`);

    //2. 특정 경로의 모든 동적 페이지를 재검증
    // revalidatePath("/book/[id]", "page");

    // 3. 특정 레이아웃을 갖는 모든 페이지 재검증
    // revalidatePath("/(with-searchbar)", "layout");

    // 4. 인덱스 경로에 있는 레이아웃인 루트 레트레이아웃을 갖는 모든 페이지들이 전부 다 재검증이 됨
    // revalidatePath("/", "layout");

    //5. 태그 기준, 데이터 캐시 재검증 -> fetch를 통해 데이터를 가져올때 아래 태그를 갖는 데이터캐시만 삭제하고 이를 재검증
    // 이 방법은 1번과 비교해야함. 1번은 특정경로의 페이지에 해당하는 모든 데이터캐시를 삭제함
    revalidateTag(`review-${bookId}`);
    return {
      status: true,
      error: "",
    };
  } catch (err) {
    return {
      status: false,
      error: `리뷰 저장에 실패했습니다 : ${err}`,
    };
  }
}
