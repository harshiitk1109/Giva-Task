import React, { useState, useEffect } from 'react';

const App = () => {
    const [products, setProducts] = useState([]);
    const [formState, setFormState] = useState({ name: '', description: '', price: '', quantity: '' });
    const [editingId, setEditingId] = useState(null);

    // Fetch all products when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products'); // Ensure this points to the correct port
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Function to handle form submission (for both adding and editing)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `http://localhost:5000/products/${editingId}` : 'http://localhost:5000/products';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            // Ensure the response is OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchProducts(); // Refresh the product list
            setFormState({ name: '', description: '', price: '', quantity: '' }); // Clear form
            setEditingId(null); // Reset editing state
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    // Function to handle editing (populate form with the product data)
    const handleEdit = (product) => {
        setFormState(product);
        setEditingId(product.id);
    };

    // Function to delete a product
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/products/${id}`, {
                method: 'DELETE',
            });
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Product Management</h1>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formState.description}
                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formState.price}
                                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formState.quantity}
                                onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Edit' : 'Add'} Product
                        </button>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="text-center mb-4">Product List</h2>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>${product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;
