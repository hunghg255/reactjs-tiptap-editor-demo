import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
    <Editor />
    </>
  );
}
