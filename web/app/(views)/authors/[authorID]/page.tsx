export default function AuthorPage({ params }: { params: { authorID: string } }) {
  return <div>Hello World - Author: {params.authorID}</div>;
}
