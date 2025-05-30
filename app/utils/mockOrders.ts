export const mockOrders = [
  {
    id: 1,
    date: "2023-01-15",
    total: 150.0,
    status: "Delivered",
    items: [
      { name: "Modern Art Print", quantity: 2, price: 30.0 },
      { name: "Abstract Sculpture", quantity: 1, price: 90.0 },
    ],
  },
  {
    id: 2,
    date: "2023-02-20",
    total: 220.0,
    status: "Processing",
    items: [
      { name: "Vintage Painting", quantity: 1, price: 120.0 },
      { name: "Contemporary Art Book", quantity: 2, price: 50.0 },
    ],
  },
  {
    id: 3,
    date: "2023-03-10",
    total: 85.0,
    status: "Shipped",
    items: [
      { name: "Artistic Poster", quantity: 1, price: 45.0 },
      { name: "Art Supply Kit", quantity: 1, price: 40.0 },
    ],
  },
  // Add more orders as needed
];
