import { authenticator } from "../server/auth.server.js";
import { getSession, commitSession } from "../server/session.server.js";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
const prisma = new PrismaClient();
export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  const session = await getSession(request.headers.get("Cookie"));

  // Kiểm tra xem người dùng đã có trong database hay chưa
  let existingUser = await prisma.user.findUnique({
    where: { email: user._json.email },
  });

  // Nếu người dùng chưa tồn tại, tạo mới trong database
  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        email: user._json.email,
        userName: user._json.name,
        picture: user._json.picture,
        isEmailVerified: user._json.email_verified,
      },
    });
  }

  // Lưu `userId` vào session
  session.set("userId", existingUser.id);

  // Gửi lại cookie có chứa session mới tạo về cho client
  return json({ user: existingUser }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Profile() {
  const { user } = useLoaderData();

  if (!user) {
    return <p>Loading...</p>; // Hoặc thông báo lỗi nếu không có người dùng
  }
  const fetcher2 = useFetcher();
  const logout = () => {
    fetcher2.submit(null, { method: "post", action: "/auth/logout" });
  };
  return (
    <header>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page" color="secondary">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
              <Button onClick={logout} >
                Sign Out
              </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </header>
  );
}
