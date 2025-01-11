import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuotesList from "../pages/Quotes/QuotesList";
import CreateQuote from "../pages/Quotes/CreateQuote";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuotesList />} />
        <Route path="/create" element={<CreateQuote />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
