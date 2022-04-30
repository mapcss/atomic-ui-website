import { Transition, useBoolean } from "@atomic_ui_react/mod.ts";
export default function Header(): JSX.Element {
  const [isShow, { on, off }] = useBoolean();
  return (
    <>
      <header className="px-4 py-2 sticky top-0 backdrop-blur-md z-1 border-b bg-white/50 border-white/30">
        <div className="container mx-auto 2xl:px-34 flex items-center">
          <a href="/">
            <h1 className="xl:px-4 text-xl leading-relaxed">
              Atomic UI
            </h1>
          </a>

          <button onClick={on}>
            <span className="i-mdi-cube" />
          </button>
        </div>
      </header>

      <Transition isShow={isShow}>
        <div className="w-50">fff</div>
      </Transition>
    </>
  );
}
