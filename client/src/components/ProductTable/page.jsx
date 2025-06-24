import { useEffect, useRef } from "react";
import "tabulator-tables/dist/css/tabulator.min.css";
import { TabulatorFull as Tabulator } from "tabulator-tables";

const EyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const DeleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6l1 14h12l1-14"/></svg>`;

export default function ProductTabulatorTable({ products }) {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);

  useEffect(() => {
    if (tableRef.current && products.length > 0) {
      tableInstance.current = new Tabulator(tableRef.current, {
        data: products,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        columns: [
          { title: "Product", field: "name", sorter: "string", headerMenu: true },
          { title: "Buying Price", field: "buyingPrice", sorter: "number", headerMenu: true },
          { title: "Quantity", field: "quantity", sorter: "number", headerMenu: true, formatter: cell => `${cell.getValue()} Unit` },
          { title: "Threshold", field: "threshold", sorter: "number", headerMenu: true, formatter: cell => `${cell.getValue()} Unit` },
          {
            title: "Expiry Date",
            field: "expiryDate",
            sorter: "date",
            headerMenu: true,
            formatter: cell => new Date(cell.getValue()).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          },
          {
            title: "Availability",
            field: "availability",
            headerMenu: true,
            formatter: function (cell) {
              const { quantity, threshold } = cell.getRow().getData();
              if (quantity === 0) return "<span style='color:red;font-weight:600;'>Out of Stock</span>";
              if (quantity <= threshold) return "<span style='color:orange;font-weight:600;'>Low Stock</span>";
              return "<span style='color:green;font-weight:600;'>In Stock</span>";
            }
          },
          {
            title: "Actions",
            hozAlign: "center",
            headerSort: false,
            formatter: () => `
              <div class="action-buttons" style="display:flex; gap:6px; justify-content:center;">
                <button class="btn-view" title="View" style="border:none;background:none;cursor:pointer;">${EyeIcon}</button>
                <button class="btn-edit" title="Edit" style="border:none;background:none;cursor:pointer;">${EditIcon}</button>
                <button class="btn-delete" title="Delete" style="border:none;background:none;cursor:pointer;">${DeleteIcon}</button>
              </div>
            `,
            cellClick: function (e, cell) {
              const product = cell.getRow().getData();
              if (e.target.closest(".btn-view")) {
                console.log("View", product);
              } else if (e.target.closest(".btn-edit")) {
                console.log("Edit", product);
              } else if (e.target.closest(".btn-delete")) {
                console.log("Delete", product);
              }
            }
          }
        ]
      });

      return () => {
        tableInstance.current?.destroy();
      };
    }
  }, [products]);

  return <div ref={tableRef}></div>;
}
