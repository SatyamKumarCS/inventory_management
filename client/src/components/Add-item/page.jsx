// src/components/ItemTable.jsx
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css'; 


export default function ItemTable() {
    const tableRef = useRef(null); 
    useEffect(() => {
        axios.get("http://localhost:3001/api/items")
            .then((res) => {
                const table = new Tabulator(tableRef.current, {
                    data: res.data,
                    layout: "fitDataFill",
                    pagination: "local",

                    paginationSize: 10,
                    movableColumns: true,
                    resizableRows: true,
                    columns: [
                        { title: "Name", field: "name", sorter: "string", headerFilter: "input" },
                        { title: "Product ID", field: "productId", sorter: "string" },
                        { title: "Category", field: "Category.name", sorter: "string" },
                        { title: "Subcategory", field: "SubCategory.name", sorter: "string" },
                        { title: "Specification", field: "specification" },
                        { title: "Brand", field: "brand" },
                        {
                            title: "Invoice Date",
                            field: "invoiceDate",
                            formatter: cell => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "-"
                        },
                        {
                            title: "Expiry Date",
                            field: "expiryDate",
                            formatter: cell => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "-"
                        },
                        { title: "UOM", field: "unitOfMeasurement" },
                        { title: "Opening Stock", field: "openingStock" },
                        {
                            title: "As On Date",
                            field: "asOnDate",
                            formatter: cell => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "-"
                        },
                        { title: "Min Stock", field: "minStockLevel" },
                        { title: "Unit Price", field: "unitPrice" },
                        { title: "GST", field: "gstRate", formatter: cell => `${cell.getValue()}%` },
                        {
                            title: "Actions",
                            field: "actions",
                            hozAlign: "center",
                            formatter: () => `
                                <button class="view-btn">👁️</button>
                                <button class="edit-btn">✏️</button>
                                <button class="delete-btn">🗑️</button>
                            `,
                            cellClick: function (e, cell) {
                                const row = cell.getRow().getData();
                                if (e.target.classList.contains("view-btn")) {
                                    alert("View clicked: " + row.name);
                                } else if (e.target.classList.contains("edit-btn")) {
                                    alert("Edit clicked: " + row.name);
                                } else if (e.target.classList.contains("delete-btn")) {
                                    alert("Delete clicked: " + row.name);
                                }
                            }
                        },
                    ],
                });

                
                return () => {
                    table.destroy();
                };
            })
            .catch((err) => {
                console.error("Error fetching items:", err);
            });
    }, []);

    return (
        <div>
            <h2 style={{ margin: '20px 0' }}>Item List</h2>
            <div ref={tableRef} />
        </div>
    );
}
