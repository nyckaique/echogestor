import "./title.css";
export default function Title({ children, name }: any) {
  return (
    <div className="title">
      {children}
      <h1>{name}</h1>
    </div>
  );
}
