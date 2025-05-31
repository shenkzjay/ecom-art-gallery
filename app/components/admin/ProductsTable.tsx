import React from "react";
import type { ProductType } from "~/server/models/product";

interface ProductsTableProps {
  products: ProductType[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div>
      <h3>Products Table</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Author</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{product.product_title}</td>
              <td>{product.product_price}</td>
              <td>{product.product_author.profile?.name || "Unknown"}</td>
              <td>{product.product_category.categoryName || "Unknown"}</td>
              <td>
                {product.product_date
                  ? new Date(product.product_date).toLocaleDateString()
                  : "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
