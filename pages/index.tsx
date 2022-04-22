const navLinks: { name: string; path: string }[] = [{
  name: "transition",
  path: "/react/transition",
}];

export default function Home(): JSX.Element {
  return (
    <>
      {navLinks.map(({ name, path }) => {
        return <a key={name} href={path}>{name}</a>;
      })}
    </>
  );
}
