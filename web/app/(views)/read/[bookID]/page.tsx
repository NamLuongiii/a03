export default function ReadingPage({ params }: { params: { bookID: string } }) {
  return <div>Hello World - Reading: {params.bookID}</div>;
}
