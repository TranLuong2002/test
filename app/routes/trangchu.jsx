import { Button } from "@nextui-org/react";
import { CameraIcon } from "./CameraIcon";
export default function Index() {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p>This is the content of the home page.</p>
        <Button color="success" endContent={<CameraIcon />}>
          Take a photo
        </Button>
      </div>
    </div>
  );
}

