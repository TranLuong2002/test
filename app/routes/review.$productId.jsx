import { json } from "@remix-run/node";
import { prisma } from "../server/db.server";

import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
// Loader để lấy dữ liệu review theo productId
export const loader = async ({ params }) => {
  const { productId } = params;

  // Tìm tất cả các đánh giá cho sản phẩm dựa trên productId
  const reviews = await prisma.review.findMany({
    where: { productId },
  });

  if (!reviews || reviews.length === 0) {
    return json({ message: "Không tìm thấy đánh giá" }, { status: 404 });
  }

  return json(reviews); // Trả về danh sách review
};
export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const url = formData.get("url");

  try {
    const response = await axios.get(url);
    const data = response.data;

    return json({ data });
  } catch (error) {
    return json({ error: "Không thể cào dữ liệu từ URL cung cấp." });
  }
};
export default function ReviewList() {
  const reviews = useLoaderData();
  const action = useActionData();
  // Kiểm tra nếu reviews không phải là một mảng, gán nó thành mảng rỗng
  const validReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Product Reviews</h1>

      {/* Kiểm tra nếu không có review nào */}
      {validReviews.length === 0 ? (
        <p>Không có review nào cho sản phẩm này.</p>
      ) : (
        <ul className="space-y-4">
          {validReviews.map((review) => (
            <li key={review.id} className="border p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{review.userName}</h2>
              {review.userAvatar && (
                <img src={review.userAvatar} alt="User Avatar" width="50" className="mt-2" />
              )}
              {review.productImage && (
                <div className="mt-4">
                  <img
                    src={review.productImage}
                    alt="hình ảnh review"
                    width="200"
                    className="rounded-lg shadow"
                  />
                </div>
              )}
              <p>{review.reviewContent}</p>
              <p className="text-gray-500">Rating: {review.rating}/5</p>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h1>Crawl Data</h1>
        <Form method="post" action="/crawl">
          <label htmlFor="url">Nhập URL:</label>
          <input type="text" name="url" id="url" required />
          <button type="submit">Crawl Data</button>
        </Form>
      {action?.error && <p>{action.error}</p>}
      {action?.data && <pre>{JSON.stringify(action.data, null, 2)}</pre>}
      </div>
    </div>
  );
}

