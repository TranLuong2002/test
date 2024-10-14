import { Link } from "@nextui-org/react";
import { useState, useEffect } from "react";
// Đổi tên component items thành Items
function Items() {
  return (
    <div>
      <p>My name is Items</p>
    </div>
  );
}

export default function Index() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center ">
      <article>
        <h1>My First Component</h1>
        <ol className="grid gap-4 grid-cols-2 grid-rows-2">
          <li>Components: UI Building Blocks</li>
          <li>Defining a Component</li>
          <li>Using a Component</li>
        </ol>
      </article>

      <div>
        {/* Sửa lại className đúng cú pháp */}
        <Link
          className="flex m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600"
          href="/react2"
        >
          Click to react2
        </Link>
      </div>

      {/* Gọi component Items */}
      <div>
        <Items />
      </div>
      <div>
        <Search />
      </div>
    </div>
  );
}

function Search() {
  const people = [
    {
      id: 0,
      name: "Creola Katherine Johnson",
      profession: "mathematician",
    },
    {
      id: 1,
      name: "Mario José Molina-Pasquel Henríquez",
      profession: "chemist",
    },
    {
      id: 2,
      name: "Mohammad Abdus Salam",
      profession: "physicist",
    },
    {
      id: 3,
      name: "Percy Lavon Julian",
      profession: "chemist",
    },
    {
      id: 4,
      name: "Subrahmanyan Chandrasekhar",
      profession: "astrophysicist",
    },
  ];

  const [searchTerm, setSearchTerm] = useState(""); // Tạo state cho chuỗi tìm kiếm
  const [filteredPeople, setFilteredPeople] = useState(people); // Tạo state cho danh sách sản phẩm đã lọc
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setMessage("Input đang rỗng");
    } else {
      setMessage("Đang đợi kết quả...");
    }
  };

  // Cập nhật danh sách sản phẩm đã lọc khi searchTerm thay đổi
  useEffect(() => {
    setFilteredPeople(
      people.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, people]);

  return (
    <div>
      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search for a name..."
          value={searchTerm} // Gắn giá trị input với searchTerm
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi nhập liệu
          className="input-seach"
        />
        <button
          className="btn-primary"
          onClick={handleSearch} // Gọi hàm xử lý khi nhấn nút
        >
          Search
        </button>
      </div>
      {/* Hiển thị thông báo */}
      {message && <p>{message}</p>}

      <div className="gap-5 overflow-auto w-60 h-32">
        {filteredPeople.map((person) => (
          <div key={person.id} className="border-b py-2">
            <strong>{person.name}</strong> - <em>{person.profession}</em>
          </div>
        ))}
      </div>
      
    </div>
  );
}
