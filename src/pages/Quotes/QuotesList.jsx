import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuotesTable from "../../components/QuotesTable";
import db from "../../db/db";

const QuotesList = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);

  // Fetch data from IndexedDB
  useEffect(() => {
    const fetchQuotes = async () => {
      const allQuotes = await db.quotes.toArray();
      setQuotes(allQuotes);
    };

    fetchQuotes();

    // Listen for IndexedDB updates
    db.quotes.hook("creating", () => fetchQuotes());
    db.quotes.hook("updating", () => fetchQuotes());
    db.quotes.hook("deleting", () => fetchQuotes());

    return () => {
      db.quotes.hook("creating").unsubscribe();
      db.quotes.hook("updating").unsubscribe();
      db.quotes.hook("deleting").unsubscribe();
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Quotes Overview</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/create")}
        >
          Create Quote
        </button>
      </div>

      {/* Render the QuotesTable component */}
      <QuotesTable data={quotes} />
    </div>
  );
};

export default QuotesList;
