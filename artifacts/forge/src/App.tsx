import { Switch, Route, Router as WouterRouter } from "wouter";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Wizard from "./pages/Wizard";
import Success from "./pages/Success";
import NotFound from "./pages/not-found";
import Toaster from "./components/Toaster";
import CommandPalette from "./components/CommandPalette";
import ConfirmDialog from "./components/ConfirmDialog";
import KeyboardHelp from "./components/KeyboardHelp";
import { initTheme } from "./hooks/useTheme";
import { consumeConfigFromUrl } from "./lib/shareConfig";
import { useWizard } from "./lib/store";
import { toast } from "./lib/toast";

function App() {
  useEffect(() => {
    initTheme();
    // If a ?config=... is present, hydrate the wizard from it.
    const incoming = consumeConfigFromUrl();
    if (incoming) {
      useWizard.setState({ ...incoming, step: 0 });
      // Defer toast so the Toaster has mounted
      setTimeout(() => {
        toast.success("Config loaded from link", "Your wizard has been pre-filled.");
      }, 200);
    }
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
      <ConfirmDialog />
      <KeyboardHelp />
      <Toaster />
    </WouterRouter>
  );
}

export default App;
