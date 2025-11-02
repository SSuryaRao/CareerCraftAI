
export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-600 mb-6">
          If you see:
        </p>
        <ul className="space-y-2 text-left">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Blue to purple gradient background
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            White card with shadow
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Styled text and spacing
          </li>
        </ul>
        <button className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Tailwind is Working! 🎉
        </button>
      </div>
    </div>
  )
}