"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

//에러 발생시, 넥스트js는 Error컴포넌트에게 error객체를 props로 전달해줌
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <div>
      <h3>검색과정에서 오류가 발생했습니다!!!</h3>
      <button
        onClick={
          () => {
            startTransition(() => {
              //아래 refresh와 reset을 모두 일괄적으로 동시에 처리
              //startTransition없이 아래 2개만 써도 원하는대로 작동x
              router.refresh(); // 현재 페이지에 필요한 서버컴포넌트들을(예시:인덱스화면) 서버측에서 다시 실행해서 RSC payload를 브라우저측으로 전달해달라는 의미
              reset(); // 에러 상태를 초기화, 컴포넌트들을 다시 렌더링
            });
          }
          // window.location.reload() // 이것만 할경우 정리
          // reset() //reset만할경우 정리
        }
      >
        다시 시도
      </button>
    </div>
  );
}
