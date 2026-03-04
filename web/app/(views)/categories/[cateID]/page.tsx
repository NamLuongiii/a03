export default function CategoryPage({ params }: { params: { cateID: string } }) {
  return <div>Hello World - Category: {params.cateID}</div>;
}
