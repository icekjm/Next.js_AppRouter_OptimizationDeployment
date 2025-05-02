"use client";

import style from "./review-editor.module.css";
import { createReviewAction } from "@/actions/create-review.action";
import { useActionState, useEffect } from "react";

//use server라는 지시자를 통해 서버액션을 만들고 해당하는 서버액션을 호출하는 form을 브라우저에서 제출하게되면
//자동으로 서버액션을 호출하는 HTTP 요청이 서버로 전송하게 되고
// 이런 서버액션들은 컴파일 결과 자동으로 특정 해시값을 갖는 API로서 설정이되서
//  request Header의 Next action이라는 항목에 위 특정 해시값이 나타남
export default function ReviewEditor({ bookId }: { bookId: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <section>
      <form className={style.form_container} action={formAction}>
        <input name="bookId" value={bookId} hidden readOnly />
        <textarea
          disabled={isPending}
          required
          name="content"
          placeholder="리뷰 내용"
        ></textarea>
        <div className={style.submit_container}>
          <input
            disabled={isPending}
            required
            name="author"
            placeholder="작성자"
          ></input>
          <button disabled={isPending} type="submit">
            {isPending ? "..." : "작성하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
