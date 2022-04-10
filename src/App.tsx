import { Sidebar } from "./components/Sidebar";
import { Timeline } from "./components/Timeline";
import { Viewport } from "./components/Viewport";

export function App() {
  return (
    <div>
      <Sidebar />
      <Viewport />
      <Timeline />
    </div>
  );
}
