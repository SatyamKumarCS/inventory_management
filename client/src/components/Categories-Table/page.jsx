import React from "react";
import {
    Table, TableHead, TableRow, TableCell, TableBody, IconButton,
} from "@mui/material";
import { SquarePen, Trash2 } from "lucide-react";
import './style.css';


const CategoriesTable = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="categories-table-container">
            <h2 className="categories-table-title">Category List</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="table-header-cell">S.No</TableCell>
                        <TableCell className="table-header-cell">Category Name</TableCell>
                        <TableCell className="table-header-cell">Sub Categories</TableCell>
                        <TableCell className="table-header-cell">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((cat, index) => (
                        <TableRow key={cat.id} className="table-row">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{cat.name}</TableCell>
                            <TableCell>
                                {cat.subcategories?.length
                                    ? cat.subcategories.join(", ")
                                    : "No subcategories"}
                            </TableCell>
                            <TableCell>
                                <div className="action-buttons">
                                <IconButton onClick={() => onEdit(cat)}>
                                        <SquarePen color="green" size={20} />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(cat.id)}>
                                        <Trash2 color="red" size={20} />
                                    </IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
};

export default CategoriesTable;
