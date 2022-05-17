export default function Home(): JSX.Element {
  return (
    <>
      <div className="grid place-content-center h-screen">
        <div className="text-center space-y-10 max-w-md">
          <p className="text-5xl">Atomic UI</p>

          <p className="text-3xl">
            Completely unstyled, fully accessible UI components, designed to
            integrate beautifully with Tailwind CSS.
          </p>

          <a href="/react" className="rounded-full inline-block border p-2">
            Getting Started
          </a>
        </div>
      </div>
    </>
  );
}
