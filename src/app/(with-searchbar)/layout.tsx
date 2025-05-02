import { ReactNode, Suspense } from "react";
import Searchbar from "../../components/searchbar";

//클라이언트 라우트 캐시는 브라우저 새로고침 누르면 전부 지워짐
//이 레이아웃 컴포넌트는 브라우저에 저장됨(/페이지 그리고 /search페이지 요청할경우)
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* 클라이언트라우트캐시 <div>{new Date().toLocaleString()}</div> */}
      <Suspense fallback={<div>Loading ...</div>}>
        <Searchbar />
      </Suspense>
      {children}
    </div>
  );
}
