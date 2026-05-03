import { Switch, Route, Router as WouterRouter } from "wouter";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Wizard from "./pages/Wizard";
import Success from "./pages/Success";
import NotFound from "./pages/not-found";
import Toaster from "./components/Toaster";
import CommandPalette from "./components/CommandPalette";
import { initTheme } from "./hooks/useTheme";

function App() {
  useEffect(() => {
    initTheme();
  }, []);
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/forge" component={Wizard} />
        <Route path="/success" component={Success} />
        <Route component={NotFound} />
      </Switch>
      <CommandPalette />
      <Toaster />
    </WouterRouter>
  );
}

export default App;
