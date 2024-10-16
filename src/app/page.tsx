// import Editor from "@/components/Editor/Editor";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
});
// const ModalEditor = dynamic(() => import("@/components/ModalEditor/ModalEditor"), {
//   ssr: false,
// });

export default function Home() {
  return (
    <>
    <Editor />
    </>
  );
}
