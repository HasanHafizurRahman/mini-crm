import Dexie from "dexie";

// Initialize Dexie database
const db = new Dexie("QuotesDB");
db.version(1).stores({
  quotes: "++id, subject, quoteStage, grandTotal, dealName, contactName, accountName, quoteOwner",
});

// Add some sample data (only for testing)
db.on("populate", () => {
  db.quotes.bulkAdd([
    {
      subject: "Website Development",
      quoteStage: "Draft",
      grandTotal: 120000,
      dealName: "Chapman",
      contactName: "Sage Wieser",
      accountName: "Truhlar and Truhlar",
      quoteOwner: "Hasan Hafizur Rahman",
    },
    {
      subject: "Mobile App Development",
      quoteStage: "Negotiation",
      grandTotal: 80000,
      dealName: "Acme Corp",
      contactName: "John Doe",
      accountName: "Doe Enterprises",
      quoteOwner: "Jane Smith",
    },
  ]);
});

export default db;
