import { Switch, Route, Router as WouterRouter } from "wouter";
import Landing from "./pages/Landing";
import Wizard from "./pages/Wizard";
import Success from "./pages/Success";
import NotFound from "./pages/not-found";

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/forge" component={Wizard} />
        <Route path="/success" component={Success} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
