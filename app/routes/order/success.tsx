export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-green-500">Payment Successful!</h1>
      <p className="text-xl mt-4">Thank you for your purchase.</p>
      <a href="/" className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Home
      </a>
    </div>
  );
}
