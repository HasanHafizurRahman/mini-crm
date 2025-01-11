import React, { useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const QuotesTable = ({ data }) => {
  const [filters, setFilters] = useState({
    subject: "",
    quoteStage: "",
    minTotal: "",
    maxTotal: "",
  });

  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        width: 50,
      },
      { headerName: "Subject", field: "subject", filter: true, sortable: true },
      { headerName: "Quote Stage", field: "quoteStage", filter: true, sortable: true },
      { headerName: "Grand Total", field: "grandTotal", filter: true, sortable: true },
      { headerName: "Deal Name", field: "dealName", filter: true, sortable: true },
      { headerName: "Contact Name", field: "contactName", filter: true, sortable: true },
      { headerName: "Account Name", field: "accountName", filter: true, sortable: true },
      { headerName: "Quote Owner", field: "quoteOwner", filter: true, sortable: true },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filter: true,
      sortable: true,
    }),
    []
  );

  const onFilterChange = useCallback((field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const { subject, quoteStage, minTotal, maxTotal } = filters;

      const matchesSubject = subject ? row.subject.toLowerCase().includes(subject.toLowerCase()) : true;
      const matchesQuoteStage = quoteStage ? row.quoteStage.toLowerCase().includes(quoteStage.toLowerCase()) : true;
      const matchesMinTotal = minTotal ? row.grandTotal >= parseFloat(minTotal) : true;
      const matchesMaxTotal = maxTotal ? row.grandTotal <= parseFloat(maxTotal) : true;

      return matchesSubject && matchesQuoteStage && matchesMinTotal && matchesMaxTotal;
    });
  }, [data, filters]);

  return (
    <div className="flex">
      {/* Filters Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">Filter Quotes</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            value={filters.subject}
            onChange={(e) => onFilterChange("subject", e.target.value)}
            className="border rounded w-full px-2 py-1"
            placeholder="Search by subject"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Quote Stage</label>
          <input
            type="text"
            value={filters.quoteStage}
            onChange={(e) => onFilterChange("quoteStage", e.target.value)}
            className="border rounded w-full px-2 py-1"
            placeholder="Search by quote stage"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Grand Total (Min)</label>
          <input
            type="number"
            value={filters.minTotal}
            onChange={(e) => onFilterChange("minTotal", e.target.value)}
            className="border rounded w-full px-2 py-1"
            placeholder="Min total"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Grand Total (Max)</label>
          <input
            type="number"
            value={filters.maxTotal}
            onChange={(e) => onFilterChange("maxTotal", e.target.value)}
            className="border rounded w-full px-2 py-1"
            placeholder="Max total"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-3/4 p-4">
        <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default QuotesTable;
