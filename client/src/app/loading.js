export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h2>
                <p className="text-gray-600">Please wait while we load your content</p>
            </div>
        </div>
    );
}
