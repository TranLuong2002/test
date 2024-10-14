import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { prisma } from "../server/db.server";
import { getSession } from "../server/session.server";
import { Link } from '@remix-run/react';
import { useParams } from "@remix-run/react";
import { useState, useEffect } from "react";
// Lấy sản phẩm theo userId
export const loader = async ({ request }) => {
  // Lấy session từ người dùng
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login"); // Chuyển hướng về trang đăng nhập nếu người dùng chưa đăng nhập
  }

  // Tìm các sản phẩm liên kết với userId
  const products = await prisma.product.findMany({
    where: { userId },
  });

  if (products.length === 0) {
    return redirect("/product"); // Chuyển hướng về trang tạo sản phẩm nếu chưa có sản phẩm
  }

  return json(products); // Trả về danh sách sản phẩm của người dùng

};

// Thêm sản phẩm mới
export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const url = formData.get("url");

  // Lấy session từ phiên người dùng
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return json({ error: "Người dùng chưa đăng nhập" }, { status: 401 });
  }

  if (!name) {
    return json({ error: "Lỗi nhập dữ liệu" }, { status: 400 });
  }

  // Tạo sản phẩm mới và liên kết với userId
  await prisma.product.create({
    data: {
      name,
      description,
      url,
      userId, // Gắn sản phẩm với userId
    },
  });

  return redirect("/Home"); // Chuyển hướng về trang danh sách sản phẩm


  // crwal data
  
};

// Component hiển thị sản phẩm
export default function ProductList() {
  const products = useLoaderData();
  const actionData = useActionData();
  const transition = useNavigation();
  const params = useParams();

  const [searchTerm, setSearchTerm] = useState(""); // Tạo state cho chuỗi tìm kiếm
  const [filteredProducts, setFilteredProducts] = useState(products); // Tạo state cho danh sách sản phẩm đã lọc

  // Cập nhật danh sách sản phẩm đã lọc khi searchTerm thay đổi
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Tìm kiếm sản phẩm */}
      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm} // Gắn giá trị input với searchTerm
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi nhập liệu
          className="border rounded-lg px-4 py-2 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Search
        </button>
      </div>

      {/* Nút thêm sản phẩm mới */}
      <details className="mb-8 text-center">
        <summary className="cursor-pointer text-blue-500 text-lg">
          + Add New Product
        </summary>
        <Form method="post" className="mt-4 space-y-4">
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          <div>
            <label htmlFor="name" className="block text-left">Product Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-left">Description</label>
            <textarea
              name="description"
              id="description"
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-left">Product Image URL</label>
            <input
              type="text"
              name="url"
              id="url"
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            {transition.state === "submitting" ? "Adding..." : "Add Product"}
          </button>
        </Form>
      </details>

      {/* Danh sách sản phẩm */}
      <ul className="space-y-6">
        {filteredProducts.map((product) => (
          <li key={product.id} className="border p-4 rounded-lg shadow-lg">
            {params.projectId === product.id ? <Spinner /> : null}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description || "No description available"}</p>

            {product.url && (
              <img src={product.url} alt={product.name} width="200" className="mt-2 rounded-lg" />
            )}
            <p className="text-gray-500">Created at: {new Date(product.createdAt).toLocaleDateString()}</p>
            <Link to={`/review/${product.id}`} className="text-blue-500 underline">
              View Reviews
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

