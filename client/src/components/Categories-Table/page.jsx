import React from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip,
} from "@mui/material";
import { SquarePen, Trash2 } from "lucide-react";
import "./style.css";

const CategoriesTable = ({ categories, onEdit, onDelete }) => {
    // console.log("🧾 CategoriesTable received categories:", categories);

    return (
        <div className="categories-table-container">
            <h2 className="categories-table-title">Category & Sub Category List</h2>
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
                    {categories.map((category, index) => (
                        <TableRow key={category.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                                {category.subcategories?.length > 0 ? (
                                    category.subcategories.map((sub) => (
                                        <Chip
                                            key={sub.id}
                                            label={sub.name}
                                            style={{ marginRight: "5px", marginBottom: "5px" }}
                                        />
                                    ))
                                ) : (
                                    <i>No subcategories</i>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="action-buttons">
                                    <IconButton onClick={() => onEdit(category)}>
                                        <SquarePen color="green" size={20} />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(category)}>
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
