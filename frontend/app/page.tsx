"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number | string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:3000/products";

  async function loadProducts() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Failed to load products");
      setProducts(await response.json());
      setError("");
    } catch {
      setError("Could not connect to the backend.");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        setProducts(await response.json());
        setError("");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError("Could not connect to the backend.");
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        editingId === null ? API : `${API}/${editingId}`,
        {
          method: editingId === null ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price: Number(price) }),
        },
      );

      if (!response.ok) throw new Error("Could not save product");
      setSuccess(
        editingId === null
          ? "Product added successfully!"
          : "Product updated successfully!",
      );

      setName("");
      setPrice("");
      setEditingId(null);
      await loadProducts();
    } catch {
      setError("Could not save product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete product");
      }

      await loadProducts();
      setSuccess("Product deleted successfully!");
    } catch {
      setError("Could not delete product. Please try again.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setPrice("");
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Product Management</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-lg border p-5"
      >
        <h2 className="text-xl font-semibold">
          {editingId === null ? "Add Product" : "Edit Product"}
        </h2>

        <div>
          <label htmlFor="name" className="mb-1 block">
            Product Name
          </label>
          <input
            id="name"
            className="w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            className="w-full rounded border p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingId === null
              ? "Add Product"
              : "Update Product"}
        </button>
      </form>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {success && <p className="mb-4 text-green-600">{success}</p>}

      <h2 className="mb-4 text-xl font-semibold">Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Price</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border p-3">{product.id}</td>
                  <td className="border p-3">{product.name}</td>
                  <td className="border p-3">
                    {Number(product.price).toFixed(2)}
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="mr-3 text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
